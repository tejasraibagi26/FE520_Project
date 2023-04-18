import { Link } from "react-router-dom";
import { navItems_login, navItems_logout } from "../../Data/NavItems";
import { INavProps } from "../../Interfaces/interfaces";
import "./index.css";

const Nav = ({ isLoggedIn }: INavProps) => {
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <h1>Stockhood</h1>
        </div>
        <div className="items">
          <ul>{isLoggedIn ? loggedInItems() : loggedOutItems()}</ul>
        </div>
      </div>
    </div>
  );
};

const loggedInItems = () => {
  return (
    <>
      {navItems_login.map((item) => {
        return (
          <li id={item.navItemId + "_key"} key={item.navItemId}>
            <Link to={item.navItemLink} className="nav-btn border">
              {item.navItemName}
            </Link>
          </li>
        );
      })}
    </>
  );
};

const loggedOutItems = () => {
  return (
    <>
      {navItems_logout.map((item) => {
        return (
          <li id={item.navItemId} key={item.navItemId}>
            <Link to={item.navItemLink} className="nav-btn border">
              {item.navItemName}
            </Link>
          </li>
        );
      })}
    </>
  );
};

export default Nav;
