import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = ({ updateLoggedIn }: any) => {
  const navigate = useNavigate();
  useEffect(() => {
    window.localStorage.removeItem("id");
    updateLoggedIn(false);
    navigate("/login");
  }, []);

  return <div>Logging out...</div>;
};

export default LogoutPage;
