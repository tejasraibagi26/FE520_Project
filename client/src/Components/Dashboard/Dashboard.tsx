import axios from "axios";
import { useEffect, useState } from "react";
import { MdSell } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IStock } from "../../Interfaces/interfaces";
import { useAppSelector } from "../../Redux/hooks";
import "./index.css";

const Dashboard = () => {
  const API_URL = "http://127.0.0.1:5000";
  const user = useAppSelector((state) => state.user);
  const id = window.localStorage.getItem("id");
  const navigator = useNavigate();
  const [userOwnedStocks, setUserOwnedStocks] = useState<IStock[]>(user.stocks);

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
            {userOwnedStocks.map((stock) => {
              return (
                <StockCard
                  navigator={navigator}
                  stock={stock}
                  key={stock.stock_name}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const StockCard = ({ stock, navigator }: any) => {
  const openStock = () => {
    navigator(`/stock/${stock.stock_name}`);
  };
  return (
    <div className="stock-card" onClick={openStock}>
      <div className="stock-card-header">
        <div className="header-left">
          <span className={`icon ${stock.type === "buy" ? "buy" : "sell"}`}>
            <MdSell />
          </span>
          <div className="data">
            <p className="stock_name">{stock.stock_name}</p>
            <p className="color-light">Buy Price: ${stock.price}</p>
          </div>
        </div>
        <div className="header-right">
          <div className="item">
            <p className="item- color-light">Shares</p>
            <p className="item-value">{stock.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
