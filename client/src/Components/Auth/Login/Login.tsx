import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILoginPageProps } from "../../../Interfaces/interfaces";
import { setUser } from "../../../Redux/Reducers/userReducer";
import { useAppDispatch } from "../../../Redux/hooks";

import "./index.css";

const Login = ({ updateLoggedIn }: ILoginPageProps) => {
  const API_URL = "http://127.0.0.1:5000/api/v1";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userDispatch = useAppDispatch();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [apiError, setApiError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    setErrors({
      email: "",
      password: "",
    });
    setLoading(true);
    const err = validate();

    if (err) {
      setLoading(false);
      return;
    }

    axios
      .post(`${API_URL}/auth/login`, formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        if (res.data.status === "failure") {
          setApiError(res.data.message);
          return;
        }

        updateLoggedIn(true);
        userDispatch(setUser(res.data.user));
        navigate("/dashboard");
        window.localStorage.setItem("id", res.data.user._id.$oid);
        window.localStorage.setItem("username", res.data.user.username);
      })
      .catch((err) => {
        console.log(err.message);
        setApiError(err.message);
        setLoading(false);
        return;
      });
    return;
  };

  const validate = () => {
    const { email, password } = formData;
    let err = false;

    if (email.trim() === "") {
      setErrors({ ...errors, email: "Email is required" });
      err = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ ...errors, email: "Email is invalid" });
      err = true;
    }
    if (password.trim() === "") {
      setErrors({ ...errors, password: "Password is required" });
      err = true;
    }

    return err;
  };
  return (
    <section id="login">
      <div className="container">
        <div className="header">
          <h1>Login</h1>
        </div>
        <div className="form">
          <form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
              />
              {errors.email !== "" && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
              />
              {errors.password !== "" && (
                <p className="error">{errors.password}</p>
              )}
            </div>
          </form>
          <div
            className={`btn border width-full ${loading && "disabled"}`}
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Login"}
          </div>
          <div className="spacer" />
          {apiError !== "" && <p className="error">{apiError}</p>}
        </div>
      </div>
    </section>
  );
};

export default Login;
