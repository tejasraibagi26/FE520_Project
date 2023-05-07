import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdWarning } from "react-icons/md";
import "./index.css";

const Account = () => {
  const API = "http://127.0.0.1:5000/api/v1";
  const [toggleFunds, setToggleFunds] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [funds, setFunds] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [updateText, setUpdateText] = useState<string>("Add Funds");
  const [transactionTexts, setTransactionTexts] = useState<any[]>([
    {
      id: 1,
      text: "Connecting to payment server...",
    },
    {
      id: 2,
      text: "Verifying payment details...",
    },
    {
      id: 3,
      text: "Processing payment...",
    },
    {
      id: 4,
      text: "Payment successful!",
    },
  ]);

  const [transactionStatus, setTransactionStatus] = useState<boolean | null>(
    null
  );
  const [added, setAdded] = useState<string>("");
  const handleToggleFunds = () => {
    setToggleFunds(!toggleFunds);
  };

  const handleAddFunds = (e: any) => {
    setError("");
    if (e.target.value <= 0 && e.target.value !== "") {
      setError("Funds must be greater than 0");
      return;
    }
    setFunds(e.target.value);
  };

  const handleAddFundsSubmit = () => {
    // Loop throught the transaction texts every 1 second and update the text
    let i = 0;
    const interval = setInterval(() => {
      if (i < transactionTexts.length) {
        setUpdateText(transactionTexts[i].text);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => {
      axios
        .post(`${API}/user/balance/add`, {
          amount: funds,
          _id: window.localStorage.getItem("id"),
        })
        .then((res) => {
          if (res.data.status === "success") {
            setTransactionStatus(true);
            setAdded(res.data.message);
            setToggleFunds(false);
            const totalFunds: number = Number(balance) + Number(funds);
            setBalance(Number(totalFunds));
            setUpdateText("Add Funds");
            setTimeout(() => {
              setTransactionStatus(null);
            }, 5000);
          } else {
            setTransactionStatus(false);
          }
        })
        .catch((err) => console.log(err));
    }, 4000);
  };

  useEffect(() => {
    axios
      .get(`${API}/user`, {
        params: {
          id: window.localStorage.getItem("id"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setUsername(res.data.user.username);
        setEmail(res.data.user.email);
        setBalance(res.data.user.balance);
      });
  }, []);

  return (
    <section id="account">
      {transactionStatus !== null && (
        <>
          <div className={`banner ${transactionStatus ? "buy" : "sell"}`}>
            <div className={`banner-content`}>
              <div className="banner-text">
                <span className="banner-message">
                  {transactionStatus === true
                    ? added
                    : "Your transaction was unsuccessful!"}
                </span>
                <span className="close">
                  <AiOutlineClose
                    onClick={() => setTransactionStatus(null)}
                    title="Close"
                  />
                </span>
              </div>
            </div>
          </div>
        </>
      )}
      {toggleFunds ? (
        <div className="add-funds">
          <div className="container">
            <div className="header">
              <h1>Add Funds</h1>
            </div>
            <div className="content">
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  placeholder="Enter amount"
                  type="number"
                  className="form-control"
                  onChange={handleAddFunds}
                />
              </div>

              <div>
                {error && (
                  <>
                    <div className="spacer"></div>
                    <MdWarning /> {error}
                  </>
                )}
              </div>
              <div className="spacer"></div>
              <div className="btn border" onClick={handleAddFundsSubmit}>
                <p>{updateText}</p>
              </div>
              <div className="spacer"></div>
              <div className="pointer" onClick={handleToggleFunds}>
                <p>Cancel</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container_top">
          <div className="header">
            <h1>Account</h1>
          </div>
          <div className="content">
            <div className="account">
              <div className="account__info">
                <div className="account__info__item">
                  <h3>Username</h3>
                  <p className="text">{username}</p>
                </div>
              </div>
              <div className="account__info">
                <div className="account__info__item">
                  <h3>Email</h3>
                  <p className="text">{email}</p>
                </div>
              </div>
              <div className="account__info">
                <div className="account__info__item">
                  <h3>Password</h3>
                  <p className="text">************</p>
                </div>
              </div>
              <div className="account__info">
                <div className="account__info__item">
                  <h3>Balance</h3>
                  <p className="text">${balance}</p>
                </div>
                <div className="add btn border" onClick={handleToggleFunds}>
                  <p>Add Funds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Account;
