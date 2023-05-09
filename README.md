# FE520_Project

This is a final project for FE520 class.

# Topic

Stockhood - A Robinhood clone website

# Description

A website created using React TypeScript for front-end and Python, Flask for back-end development.
The website has the following features:

- Create / Login to an account
- View Dashboard for your current portfolio and Watchlist of your favourite stocks
- Buy / Sell Stocks based on the Quantity or Amount
- View Charts of specific stocks

# Setup

### **[CLIENT]** Use the command below to install required dependencies

```
npm install
```

### **[SERVER]** Use the command below to install required dependencies

```
pip install -r requirements.txt
```

# How to run the scripts

## **[CLIENT]** Use the command below to start the client

```
npm run dev
```

- The website should run on http://localhost:5173/

## **[SERVER]** Use the command below to start the server

```
python3 run.py
```

# Backend API

- Current Version: v1
- Base URL: http://127.0.0.1/api/v1

## Routes

- Auth

  - Login

  ```js
  Endpoint: "/auth/login"

  Request Body: {
      "email": string,
      "password": string
  }

  Response: {
      "message": string,
      "status": string,
      "status-code": HTTPStatusCode,
      "user": userObject,
  }

  Example Response: {
      "message": "User found in db",
      "status": "success",
      "status-code": 200,
      "user": {
          "_id": {
              "$oid": "645a8f05842a21f074db1e9e"
          },
          "balance": 0.0,
          "email": "w@user.com",
          "stocks": [],
          "transactions": [],
          "username": "usr2",
          "watchlist": []
      }
  }
  ```

  - Sign Up

  ```js
  Endpoint: "/auth/signup"

  Request Body: {
      "email": string,
      "password": string,
      "confPassword": string,
      "username": string
  }

  Response Body: {
      "message": string,
      "status": string,
      "status-code": HTTPStatusCode,
  }

  Example Response: {
      "message": "User added to db with id: 645a8f05842a21f074db1e9e",
      "status": "success",
      "status-code": 200
  }

  ```

- Trade

  - Buy Stock:

  ```js
  Endpoint: "/trade/buy"

  Request Body: {
      "stock_name": string,
      "quantity": number,
      "price": number,
      "perSharePrice": number,
      "_id": string
  }

  Response Body: {
      "message": string,
      "modified": boolean,
      "new_balance": number,
      "status": "string,
      "status-code": HTTPStatusCode
  }

  Example Response: {
      "message": "Stock bought",
      "modified": true,
      "new_balance": 328.6,
      "status": "success",
      "status-code": 200
  }
  ```

  - Sell Stock

  ```js
    Endpoint: "/trade/sell"

    Request Body: {
        "stock_name": string,
        "quantity": number,
        "price": number,
        "perSharePrice": number,
        "_id": string
    }

    Response Body: {
        "message": string,
        "modified": boolean,
        "new_balance": number,
        "status": "string,
        "status-code": HTTPStatusCode
    }

    Example Response: {
        "message": "Stock sold",
        "modified": true,
        "new_balance": 527.6,
        "status": "success",
        "status-code": 200
    }
  ```

  - Transactions

  ```js
  Endpoint: "/transaction/get"
  Params: {
      "user_id": string
  }
  Example API URL: "/transactions/get?user_id=6433066bd85bd77304afe2c5"

  Response Body: {
    "message": string,
    "status": string,
    "status-code": HTTPStatusCode,
    "transactions": TransactionObjectArray
  }

  Example Response: {
    "message": "Transactions found in db",
    "status": "success",
    "status-code": 200,
    "transactions": [
            {
                "price": 328.6,
                "quantity": 2.0,
                "stock_name": "AAPL",
                "time": "Tue, 09 May 2023 14:25:15 GMT",
                "transaction_id": "14a113a1-07b0-4912-b810-e6ac2869aaf8",
                "type": "buy"
            },
            {
                "price": 130.0,
                "quantity": 1.0,
                "stock_name": "AAPL",
                "time": "Tue, 09 May 2023 14:27:28 GMT",
                "transaction_id": "c9efbf38-e36e-4d82-b971-50843555c1eb",
                "type": "sell"
            }
        ]
    }
  ```

  - Watchlist

  ```js
  Endpoint: "/watchlist/get"
  Params: {
      "user_id": string
  }

  Example API URL: "/watchlist/get?user_id=6433066bd85bd77304afe2c5"

  Response Body: {
    "message": string,
    "status": string,
    "status-code": HTTPStatusCode,
    "watchlist": WatchlistObjectArray
  }

  Example Response: {
      "message": "Watchlist found in db",
      "status": "success",
      "status-code": 200,
      "watchlist": [
        {
            "added_time": "Tue, 09 May 2023 14:33:51 GMT",
            "stock_name": "TSLA"
        }
      ]
  }
  ```

  - Add To Watchlist

  ```js
    Endpoint: "/watchlist/add"

    Request Body: {
        "stock_name": string,
        "id": string
    }

    Request Body: {
        "data": WatchlistObject,
        "message": "Watchlist found in db",
        "modified_count": boolean
        "status": "success",
    }

    Example Request: {
        "data": {
            "added_time": "Tue, 09 May 2023 14:33:51 GMT",
            "stock_name": "TSLA"
        },
        "message": "Stock added to watchlist",
        "modified_count": true,
        "status": "success"
    }
  ```

  - Get Stock

  ```js
      Endpoint: "/stock/yf"
      Params: {
          "stock_name": string
      }

      Example API URL: "/stock/yf?stock_name=AAPL"

      Response Body: {
          "data": StockObject,
          "status": string,
          "status-code": HTTPStatusCode
      }

      Example Response: {
          "data": {
              "current_price": 173.05,
              "high": 173.54,
              "low": 171.81,
              "previous_close": 173.5,
              "ticker": "AAPL"
          },
          "status": "success",
          "status-code": 200
      }
  ```
