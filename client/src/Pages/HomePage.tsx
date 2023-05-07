import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../Components/Home";

const HomePage = () => {
  const navigator = useNavigate();
  useEffect(() => {
    const userId = window.localStorage.getItem("id");
    if (userId) navigator("/dashboard");
  }, []);
  return <Home />;
};

export default HomePage;
