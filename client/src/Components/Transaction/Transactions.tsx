import axios from "axios";
import { useEffect, useState } from "react";
import { MdSell } from "react-icons/md";
import { ITransaction } from "../../Interfaces/interfaces";
import "./index.css";
const Transactions = () => {
  const userId = window.localStorage.getItem("id");
  const API_URL = "http://127.0.0.1:5000/api/v1";
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/transactions/get?user_id=${userId}`)
      .then((res) => {
        console.log(res.data);
        setTransactions(res.data.transactions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section id="transactions">
      <div className="containertop">
        <div className="header">
          <h1>Transactions</h1>
        </div>
        <div className="transactions">
          {transactions.map((transaction: ITransaction) => {
            return (
              <>
                <Card
                  transaction={transaction}
                  key={transaction.transaction_id}
                />
              </>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Card = ({ transaction }: any) => {
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="card" key={transaction.stock_name}>
        <div className="card-header" onClick={toggleShow}>
          <div className="card-header-left">
            <div
              className={`icon ${transaction.type === "buy" ? "buy" : "sell"}`}
            >
              <MdSell />
            </div>
            <div className="grp">
              <div className="title">
                <p>{transaction.stock_name}</p>
              </div>
            </div>
          </div>
          <div className="card-header-right">
            <div className="price">
              <p>${transaction.price}</p>
            </div>
          </div>
        </div>
        <div
          id="animated-details"
          className={`card-footer ${show ? "show" : "hide"}`}
        >
          <div className="transaction-item">
            <div className="transaction-item-name color-light">
              <p>Transaction ID</p>
            </div>
            <div className="transaction-item-value">
              <p>{transaction.transaction_id}</p>
            </div>
          </div>
          <div className="transaction-item">
            <div className="transaction-item-name color-light">
              <p>Transaction Type</p>
            </div>
            <div className="transaction-item-value">
              <p className="capitalize">{transaction.type}</p>
            </div>
          </div>
          <div className="transaction-item">
            <div className="transaction-item-name color-light">
              <p>Shares {transaction.type === "buy" ? "Bought" : "Sold"}</p>
            </div>
            <div className="transaction-item-value">
              <p>{transaction.quantity}</p>
            </div>
          </div>
          <div className="transaction-item">
            <div className="transaction-item-name color-light">
              <p>Transaction Time</p>
            </div>
            <div className="transaction-item-value">
              <p>{transaction.time}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
