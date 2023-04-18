import axios from "axios";
import { useEffect, useState } from "react";
import { MdSell } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IWatchlist } from "../../Interfaces/interfaces";
import { useAppSelector } from "../../Redux/hooks";
import "./index.css";

const Watchlist = () => {
  const user_id: any = window.localStorage.getItem("id");
  const stateWatchlists = useAppSelector((state) => state.user.watchlist);
  const navigator = useNavigate();
  const API_URL = "http://127.0.0.1:5000/api/v1";
  const [watchlist, setWatchlist] = useState<IWatchlist[]>([]);

  useEffect(() => {
    if (!user_id) navigator("/login");

    getUserWatchlists();
  }, []);

  const getUserWatchlists = () => {
    axios
      .get(`${API_URL}/watchlist/get?user_id=${user_id}`)
      .then((res) => {
        console.log(res.data);
        setWatchlist(res.data.watchlist);
      })
      .catch((err) => {});
    return null;
  };

  const redirectToStock = (stock_name: string) => {
    navigator(`/stock/${stock_name}`);
  };

  return (
    <section id="watchlist">
      <div className="containertop">
        <div className="header">
          <h1>Watchlist</h1>
        </div>
        <div className="watchlists">
          {watchlist.map((item) => {
            return (
              <div
                className="wl-card"
                key={item.stock_name}
                onClick={() => {
                  redirectToStock(item?.stock_name);
                }}
              >
                <div className="wl-card-header">
                  <div className="group">
                    <div className="icon icon-bg-black">
                      <MdSell />
                    </div>
                    <p>{item.stock_name}</p>
                  </div>
                  <p>{item.added_time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Watchlist;
