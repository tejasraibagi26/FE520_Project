import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chart from "./Components/Chart/Chart";
import Nav from "./Components/Nav";

import {
  DashboardPage,
  HomePage,
  LoginPage,
  LogoutPage,
  SearchPage,
  SignupPage,
  StockPage,
  TransactionsPage,
  WatchlistPage,
} from "./Pages";

import { useAppSelector } from "./Redux/hooks";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const user = useAppSelector((state) => state.user);

  const updateLoggedIn = (value: boolean) => {
    setLoggedIn(value);
  };

  useEffect(() => {
    const id = window.localStorage.getItem("id");
    if (id) {
      setLoggedIn(true);
    }
  }, []);
  return (
    <>
      <Router>
        <Nav isLoggedIn={loggedIn} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage updateLoggedIn={updateLoggedIn} />}
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/stock/:stockName" element={<StockPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/chart" element={<Chart />} />
          <Route
            path="/logout"
            element={<LogoutPage updateLoggedIn={updateLoggedIn} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
