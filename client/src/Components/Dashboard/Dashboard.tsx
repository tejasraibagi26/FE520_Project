import axios from "axios";
import { useEffect, useState } from "react";
import { MdSell } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/hooks";
import "./index.css";

const Dashboard = () => {
  const API_URL = "http://127.0.0.1:5000/api/v1";
  const user = useAppSelector((state) => state.user);
  const id = window.localStorage.getItem("id");
  const navigator = useNavigate();
  const [userOwnedStocks, setUserOwnedStocks] = useState<any[]>([]);

  useEffect(() => {
    if (id === "") navigator("/login");

    axios
      .get(`${API_URL}/user/stocks`, {
        params: {
          user_id: id,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUserOwnedStocks(res.data.stocks);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section id="dashboard">
      <div className="container-top">
        <div className="header">
          <h1>Dashboard</h1>
        </div>
        <div className="stocks">
          <h1>My Stocks</h1>
          <div className="stock-list">
            {userOwnedStocks.length > 0 &&
              userOwnedStocks.map((stock) => {
                return (
                  <StockCard
                    navigator={navigator}
                    stock={stock}
                    key={stock.stock_name}
                  />
                );
              })}
          </div>
          {userOwnedStocks.length === 0 && (
            <p>Stocks that are bought are shown here</p>
          )}
        </div>
      </div>
    </section>
  );
};

const StockCard = ({ stock, navigator }: any) => {
  const openStock = () => {
    navigator(`/stock/${stock.stockName}`);
  };
  return (
    <div className="stock-card" onClick={openStock}>
      <div className="stock-card-header">
        <div className="header-left">
          <span className={`icon buy`}>
            <MdSell />
          </span>
          <div className="data">
            <p className="stock_name">{stock.stockName}</p>
            <p className="color-light">
              Avg Buy Price: ${stock.averageBuyPrice}
            </p>
          </div>
        </div>
        <div className="header-right">
          <div className="item">
            <p className="item- color-light">Shares</p>
            <p className="item-value">{stock.totalShares}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
