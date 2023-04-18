import { Link } from "react-router-dom";
import "./index.css";

const Home = () => {
  return (
    <section id="home">
      <div className="container">
        <div className="header">
          <h1>Welcome to Stockhood.</h1>
          <p>Buy & Sell Stocks Instanly</p>
        </div>
        <div className="spacer" />
        <div className="apply">
          <div className="btn border">
            <Link to="/signup" className="apply">
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
