import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const API_URL = "http://127.0.0.1:5000";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confPassword: "",
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
      username: "",
      password: "",
      confPassword: "",
    });
    setLoading(true);
    const err = validate();

    if (err) {
      setLoading(false);
      return;
    }

    axios
      .post(`${API_URL}/auth/signup`, formData, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.status === "failure") {
          setApiError(res.data.message);
          setLoading(false);
          return;
        }
        navigate("/login");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setApiError(err.response.data.message);
        setLoading(false);
      });
    return;
  };

  const validate = () => {
    const { email, username, password, confPassword } = formData;
    let flag = false;
    if (!email) {
      setErrors({ ...errors, email: "Email is required" });
      flag = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ ...errors, email: "Email is invalid" });
      flag = true;
    }
    if (!username) {
      setErrors({ ...errors, username: "Username is required" });
      flag = true;
    }
    if (!password) {
      setErrors({ ...errors, password: "Password is required" });
      flag = true;
    } else if (password.length < 6) {
      setErrors({
        ...errors,
        password: "Password must be at least 6 characters",
      });
      flag = true;
    }
    if (!confPassword) {
      setErrors({ ...errors, confPassword: "Password is required" });
      flag = true;
    } else if (password !== confPassword) {
      setErrors({ ...errors, confPassword: "Passwords do not match" });
      flag = true;
    }
    if (flag) return true;

    return false;
  };

  return (
    <section id="login">
      <div className="container">
        <div className="header">
          <h1>Sign Up</h1>
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
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                onChange={handleChange}
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Repeat Password</label>
              <input
                type="password"
                name="confPassword"
                id="repeat-password"
                onChange={handleChange}
              />
              {errors.confPassword && (
                <p className="error">{errors.confPassword}</p>
              )}
            </div>
          </form>

          <div
            className={`btn border width-full ${loading && "disabled"}`}
            onClick={handleSubmit}
          >
            {loading ? "Loading..." : "Sign Up"}
          </div>
          <div className="spacer" />
          {apiError && <p className="error">{apiError}</p>}
        </div>
      </div>
    </section>
  );
};

export default Signup;
