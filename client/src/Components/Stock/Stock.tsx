import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { GrAdd, GrCheckmark } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { tickers } from "../../Data/Tickers";
import { useAppSelector } from "../../Redux/hooks";
import LineChart from "../Chart";
import "./index.css";

const Stock = () => {
  // Get stock name from URL
  const { stockName } = useParams<{ stockName: string }>();
  const [transactionType, setTransactionType] = useState("buy");
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [transactionMethod, setTransactionMethod] = useState("quantiy");
  const [canBuy, setCanBuy] = useState(false);
  const id = window.localStorage.getItem("id");
  const companyName = tickers.filter((t: any) => t.symbol === stockName)[0]
    .companyName;
  const API_URL = "http://127.0.0.1:5000";
  const [stockInWatchlist, setStockInWatchlist] = useState(false);
  const balance = useAppSelector((state) => state.user.balance);
  const addToWatchlist = () => {
    axios
      .post(`${API_URL}/watchlist/add`, {
        id: id,
        stock_name: stockName,
      })
      .then((res) => {
        setStockInWatchlist(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeFromWatchlist = () => {
    axios
      .post(`${API_URL}/watchlist/remove`, {
        id: id,
        stock_name: stockName,
      })
      .then((res) => {
        console.log(res.data);
        setStockInWatchlist(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/watchlist/get?user_id=${id}`)
      .then((res) => {
        const watchlist = res.data.watchlist;
        const isExist =
          watchlist.filter((stock: any) => stock.stock_name === stockName)
            .length > 0;

        setStockInWatchlist(isExist);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [cost, setCost] = useState(0.0);
  const [high, setHigh] = useState<number>(0);
  const [low, setLow] = useState<number>(0);
  const [diff, setDiff] = useState<number>(0.0);
  const [diffPercent, setDiffPercent] = useState<number>(0.0);

  const [prevClose, setPrevClose] = useState<number>(0);
  const costIndicatorRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState({
    labels: [""],
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: "rgb(25, 230, 140)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const API_URL = "http://127.0.0.1:5000";

    setLoading(true);
    axios
      .get(`${API_URL}/stock/yf?stock_name=${stockName}`)
      .then((res) => {
        const addToHigh = (res.data.data.high - res.data.data.low) * 2;
        setCost(res.data.data.current_price);
        setHigh(res.data.data.high + addToHigh);
        setLow(res.data.data.low);
        setPrevClose(res.data.data.previous_close);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const newCost = (Math.random() * (high - low) + low).toFixed(2);
      setDiff((prev) => Number(newCost) - cost);
      setDiffPercent((prev) => {
        const diff = Number(newCost) - cost;
        return (diff / cost) * 100;
      });
      setCost(Number(newCost));

      if (costIndicatorRef.current) {
        costIndicatorRef.current.classList.add("animate-cost");
        setTimeout(() => {
          costIndicatorRef.current?.classList.remove("animate-cost");
        }, 500);
      }
      // Add the new cost to the chart data
      setChartData((prevState: any) => {
        const newData = prevState.datasets[0].data.slice();

        newData.push(newCost);
        const newLabels = prevState.labels.slice();
        newLabels.push("");

        return {
          ...prevState,
          datasets: [
            {
              ...prevState.datasets[0],
              data: newData,
            },
          ],
          labels: newLabels,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const transactionCost =
      transactionMethod === "quantiy" ? quantity * cost : amount;

    if (transactionCost < balance) {
      setCanBuy(true);
    } else {
      setCanBuy(false);
    }
  }, [quantity, amount]);

  return (
    <section id="stock">
      <div className="container-full center ">
        <div className="left">
          <div className="ticker-name">
            <div className="ticker-title">
              <span>{companyName} </span>
              <span className="color-light"> ({stockName})</span>
            </div>
            <div className="wishlist">
              {stockInWatchlist ? (
                <span className="wishlist-icon" onClick={removeFromWatchlist}>
                  <GrCheckmark title="Remove stock from watchlist" />
                  Remove from list
                </span>
              ) : (
                <span className="wishlist-icon" onClick={addToWatchlist}>
                  <GrAdd title="Add stock to watchlist" />
                  Add to list
                </span>
              )}
            </div>
          </div>
          <LineChart
            cost={cost}
            high={high}
            low={low}
            chartData={chartData}
            diffPercent={diffPercent}
            diff={diff}
            ticker={stockName}
          />
        </div>
        <div className="right">
          <div className="buy-stock">
            <div className="options">
              <div className="option active">
                <div className="option-title">Buy</div>
              </div>
              <div className="option">
                <div className="option-title">Sell</div>
              </div>
            </div>
            <div className="spacer"></div>
            <div className="form-group">
              <label htmlFor="transaction-method">Transaction Method</label>
              <select
                name="transaction-method"
                id="transaction-method"
                onChange={(e) => setTransactionMethod(e.target.value)}
              >
                <option value="quantiy">Quantity</option>
                <option value="amount">Amount</option>
              </select>
            </div>
            {transactionType === "buy" ? (
              <BuyForm
                transactionMethod={transactionMethod}
                setQuantity={setQuantity}
                setAmount={setAmount}
                quantity={quantity}
                amount={amount}
              />
            ) : null}
          </div>
          <div className="spacer"></div>
          <div className="finalize">
            <div className="total">
              <div className="total-value">
                {transactionMethod === "quantiy"
                  ? `Buy ${quantity} share(s) of ${stockName} for $${(
                      quantity * cost
                    ).toFixed(2)}`
                  : `Buy $${(amount / cost).toFixed(2)} shares of ${stockName}`}
              </div>
              <div className="spacer"></div>
              <div
                className={`confirm-btn btn border bold ${
                  !canBuy && "illegal"
                }`}
              >
                <div>{canBuy ? "Confirm & Buy" : "Insufficient Balance"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type IBuyFormProps = {
  transactionMethod: string;
  quantity: number;
  amount?: number;
  setQuantity: (value: number) => void;
  setAmount: (value: number) => void;
};

type ITransactionFieldProps = {
  transactionTitle: string;
  transactionFieldType: string;
  transactionUniqueIdentifier: string;
  quantity?: number;
  amount?: number;
  setQuantity: (value: number) => void;
  setAmount: (value: number) => void;
};

const BuyForm = ({
  transactionMethod,
  quantity,
  amount,
  setQuantity,
  setAmount,
}: IBuyFormProps) => {
  return (
    <div className="buy-form">
      {transactionMethod === "quantiy" ? (
        <TransactionField
          transactionTitle="Quantity"
          transactionFieldType="number"
          transactionUniqueIdentifier="quantity"
          quantity={quantity}
          setQuantity={setQuantity}
          setAmount={setAmount}
        />
      ) : (
        <TransactionField
          transactionTitle="Amount"
          transactionFieldType="number"
          transactionUniqueIdentifier="amount"
          amount={amount}
          setQuantity={setQuantity}
          setAmount={setAmount}
        />
      )}
    </div>
  );
};

const SellForm = () => {
  return <div className="sell-form"></div>;
};

const TransactionField = ({
  transactionTitle,
  transactionFieldType,
  transactionUniqueIdentifier,
  quantity,
  amount,
  setQuantity,
  setAmount,
}: ITransactionFieldProps) => {
  return (
    <div className="form-group">
      <label htmlFor="quantity">{transactionTitle}</label>
      <input
        type={transactionFieldType}
        name={transactionUniqueIdentifier}
        id={transactionUniqueIdentifier}
        step={0.01}
        min={0}
        value={transactionUniqueIdentifier === "quantity" ? quantity : amount}
        onChange={(e) =>
          transactionUniqueIdentifier === "quantity"
            ? setQuantity(parseInt(e.target.value))
            : setAmount(parseInt(e.target.value))
        }
      />
    </div>
  );
};

export default Stock;
