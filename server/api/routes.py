import datetime
import uuid

from bson import ObjectId, json_util
from flask_cors import CORS, cross_origin

from api import _db, app, v1
from api.data import cutsom_parser, stock_data, user
from api.Handlers import errors_handlers
from flask import json, jsonify, request

CORS(v1)


@v1.route("/")
def index():
    return "Hello, World!"


@v1.route("/db_check")
def test():
    if _db is not None:
        return f"Connected to db, {_db}"
    else:
        return "Not connected to db"


# Deprecated
@v1.route("/tickers", methods=["GET"])
def get_tickers():
    tickers = stock_data.get_all_tickers()
    if tickers:
        return {
            "data": tickers,
            "status": "success",
        }

    return {"error": "No tickers found"}


# Deprecated
@v1.route("/stock")
def get_stock_data():
    stock = request.args.get("stock_name")
    timeline = request.args.get("timeline")
    time_unit = request.args.get("time_unit")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    try:
        stock_data = stock_data.get_stock_data(
            stock, timeline, time_unit, start_date, end_date
        )

        return {"data": stock_data}
    except Exception as e:
        return {"error": f"{e}"}


@v1.route("/stock/yf", methods=["GET"])
def get_stock_yf():
    stock_name = request.args.get("stock_name")
    check = [{"data": stock_name, "type": str, "var_name": "stock_name"}]

    try:
        errors_handlers.isEmpty(check)
        errors_handlers.isCorrectType(check)
    except Exception as e:
        return {"status": "failure", "status-code": 400, "error": f"{e}"}

    try:
        stock_data_res = stock_data.get_stock_yf(stock_name)
        return {"data": stock_data_res, "status": "success", "status-code": 200}
    except Exception as e:
        return {"status": "failure", "status-code": 500, "error": f"{e}"}


@v1.route("/auth/signup", methods=["POST"])
def add_user():
    username = request.json.get("username")
    password = request.json.get("password")
    email = request.json.get("email")
    conf_password = request.json.get("confPassword")

    check = [
        {"data": username, "type": str, "var_name": "username"},
        {"data": password, "type": str, "var_name": "password"},
        {"data": email, "type": str, "var_name": "email"},
        {"data": conf_password, "type": str, "var_name": "conf_password"},
    ]

    try:
        errors_handlers.isEmpty(check)
        errors_handlers.isCorrectType(check)
        errors_handlers.doesPasswordMatch(password, conf_password)
    except Exception as e:
        return {"status": "failure", "message": f"{e}", "status-code": 400}

    try:
        # user_exists = user.get_user_by_email(email, password, _db)
        # if user_exists is not None:
        #     raise Exception("User already exists")

        user_data = {
            "username": username,
            "password": password,
            "email": email,
            "stocks": [],
            "watchlist": [],
            "transactions": [],
            "balance": 50.0,
        }
        added_user = user.add_user(user_data, _db)

        id = added_user.inserted_id

        return {
            "status": "success",
            "message": "User added to db with id: " + str(id),
            "status-code": 200,
        }
    except Exception as e:
        return {"status": "failure", "message": f"{e}", "status-code": 500}


@v1.route("/auth/login", methods=["POST"])
@cross_origin()
def get_user():
    email = request.json.get("email")
    password = request.json.get("password")

    check = [
        {"data": email, "type": str, "var_name": "email"},
        {"data": password, "type": str, "var_name": "password"},
    ]

    try:
        errors_handlers.isEmpty(check)
        errors_handlers.isCorrectType(check)
    except Exception as e:
        return {"status": "failure", "status-code": 400, "message": f"{e}"}

    try:
        find_user = user.get_user_by_email(email, password, _db)

        return {
            "status": "success",
            "status-code": 200,
            "message": "User found in db",
            "user": cutsom_parser.parse_json(find_user),
        }

    except Exception as e:
        return {"status": "failure", "status-code": 500, "message": f"{e}"}


@v1.route("/user", methods=["GET"])
def get_user_by_id():
    _id = request.args.get("id")

    check = [{"data": _id, "type": str, "var_name": "_id"}]

    try:
        errors_handlers.isEmpty(check)
        errors_handlers.isCorrectType(check)
    except Exception as e:
        return {"status": "failure", "status-code": 400, "message": f"{e}"}

    try:
        data = user.get_user_by_id(ObjectId(_id), _db)
        return {
            "status": "success",
            "status-code": 200,
            "message": "User found in db",
            "user": cutsom_parser.parse_json(data),
        }
    except Exception as e:
        return {"status": "failure", "status-code": 500, "message": f"{e}"}


@v1.route("/user/stocks", methods=["GET"])
def get_user_stocks():
    user_id = request.args.get("user_id")

    check = [{"data": user_id, "type": str, "var_name": "user_id"}]

    try:
        errors_handlers.isEmpty(check)
        errors_handlers.isCorrectType(check)
    except Exception as e:
        return {"status": "failure", "status-code": 400, "message": f"{e}"}

    try:
        user_db = user.get_user_by_id(ObjectId(user_id), _db)
        stocks = user.get_stocks_from_user(user_db)

        return {
            "status": "success",
            "status-code": 200,
            "message": "Stocks found",
            "stocks": stocks,
        }
    except Exception as e:
        return {"status": "failure", "status-code": 404, "message": f"{e}"}


@v1.route("/trade/buy", methods=["POST"])
def buy_stock():
    # Get stock name, quantity, and price
    stock_name = request.json.get("stock_name")
    quantity = float(request.json.get("quantity"))
    price = float(request.json.get("price"))
    per_share = float(request.json.get("perSharePrice"))
    _id = request.json.get("_id")
    # Set time of transaction
    time = datetime.datetime.now()

    checks = [
        {"data": stock_name, "type": str, "var_name": "stock_name"},
        {"data": quantity, "type": float, "var_name": "quantity"},
        {"data": price, "type": float, "var_name": "price"},
        {"data": per_share, "type": float, "var_name": "per_share"},
        {"data": time, "type": datetime.datetime, "var_name": "time"},
        {"data": _id, "type": str, "var_name": "_id"},
    ]

    try:
        errors_handlers.isEmpty(checks)
        errors_handlers.isCorrectType(checks)
    except Exception as e:
        return {
            "status": "failure",
            "message": f"{e}",
        }

    user_data = user.get_user_by_id(ObjectId(_id), _db)
    user_balance = user_data["balance"]
    new_balance = user_balance - price

    user_stocks_list = user_data["stocks"]
    curr = []
    for stock in user_stocks_list:
        if stock["stockName"] == stock_name:
            curr.append(stock)

    total_shares = 0
    average_price = 0

    if len(curr) == 0:
        total_shares = quantity
        average_price = price / quantity
    else:
        for val in curr:
            for value in val["data"]:
                total_shares += value["txnQuantity"]
                average_price += value["txnAmount"]
        total_shares += quantity
        average_price = round((average_price + price) / total_shares, 2)

    print("Total shares after curr buy: ", total_shares)
    print("Average price after curr buy: ", average_price)
    txn_data = {
        "txnType": "buy",
        "txnDate": time,
        "perSharePrice": per_share,
        "txnQuantity": quantity,
        "txnAmount": price,
        "txnId": str(uuid.uuid4()),
    }

    data = []
    if len(curr) != 0:
        for val in curr:
            for value in val["data"]:
                data.append(value)

    data.append(
        txn_data,
    )

    stock_data = {
        "stockName": stock_name,
        "totalShares": total_shares,
        "averageBuyPrice": average_price,
        "data": data,
    }

    remove_old = {
        "$pull": {
            "stocks": {
                "stockName": stock_name,
            },
        }
    }

    add_stock = {
        "$push": {
            "stocks": stock_data,
            "transactions": {
                "transaction_id": str(uuid.uuid4()),
                "stock_name": stock_name,
                "quantity": quantity,
                "price": price,
                "time": time,
                "type": "buy",
            },
        },
        "$set": {"balance": round(new_balance, 2)},
    }

    try:
        if len(curr) != 0:
            user.update_user(_id, remove_old, _db)

        modify = user.update_user(_id, add_stock, _db)

        return {
            "status": "success",
            "status-code": 200,
            "message": "Stock bought",
            "modified": modify,
            "new_balance": round(new_balance, 2),
        }
    except Exception as e:
        return {"status": "failure", "status-code": 500, "message": f"{e}"}


# Sell


@v1.route("/trade/sell", methods=["POST"])
def sell_stock():
    username = request.json.get("username")
    stock_name = request.json.get("stock_name")
    quantity = float(request.json.get("quantity"))
    price = float(request.json.get("price"))
    time = datetime.datetime.now()
    _id = request.json.get("_id")

    checks = [
        {"data": stock_name, "type": str, "var_name": "stock_name"},
        {"data": quantity, "type": float, "var_name": "quantity"},
        {"data": price, "type": float, "var_name": "price"},
        {"data": username, "type": str, "var_name": "username"},
        {"data": time, "type": datetime.datetime, "var_name": "time"},
        {"data": _id, "type": str, "var_name": "_id"},
    ]

    try:
        errors_handlers.isEmpty(checks)
        errors_handlers.isCorrectType(checks)
    except Exception as e:
        return {
            "status": "failure",
            "message": f"{e}",
        }

    user_data = user.get_user_by_id(ObjectId(_id), _db)
    user_balance = user_data["balance"]
    new_balance = user_balance + price
    stocks = user_data["stocks"]

    curr = None
    for stock in stocks:
        if stock["stockName"] == stock_name:
            curr = stock

    if curr is None:
        return {
            "status": "failure",
            "message": "Stock not found",
        }

    total_shares = curr["totalShares"]
    # remove stock from stocks
    remove_stock = {
        "$pull": {
            "stocks": {
                "stockName": stock_name,
            }
        },
    }
    total_shares_after_sell = total_shares - quantity
    if total_shares_after_sell <= 0:
        update = user.update_user(ObjectId(_id), remove_stock, _db)
        return {
            "status": "success",
            "status-code": 200,
            "message": "Stock sold",
            "modified": update,
        }

    update_stock = {
        "$push": {
            "stocks": {
                "stockName": stock_name,
                "totalShares": total_shares_after_sell,
                "averageBuyPrice": curr["averageBuyPrice"],
                "data": curr["data"],
            },
            "transactions": {
                "transaction_id": str(uuid.uuid4()),
                "stock_name": stock_name,
                "quantity": quantity,
                "price": price,
                "time": time,
                "type": "sell",
            },
        },
        "$set": {"balance": round(new_balance, 2)},
    }

    user.update_user(ObjectId(_id), remove_stock, _db)
    modify = user.update_user(ObjectId(_id), update_stock, _db)

    return {
        "status": "success",
        "status-code": 200,
        "message": "Stock sold",
        "modified": modify,
    }


# Watchlist


@v1.route("/watchlist/add", methods=["POST"])
def add_to_watchlist():
    stock_name = request.json.get("stock_name")
    _id = request.json.get("id")

    added_time = datetime.datetime.now()

    checks = [
        {"data": stock_name, "type": str, "var_name": "stock_name"},
        {"data": _id, "type": str, "var_name": "id"},
        {"data": added_time, "type": datetime.datetime, "var_name": "added_time"},
    ]

    try:
        errors_handlers.isEmpty(checks)
        errors_handlers.isCorrectType(checks)
    except Exception as e:
        return {
            "status": "failure",
            "status-code": 400,
            "message": f"{e}",
        }

    data = {"stock_name": stock_name, "added_time": added_time}

    add_stock = {"$push": {"watchlist": data}}
    modify = user.update_user(_id, add_stock, _db)
    # modify = _db.user.update_one(
    #     {'_id': ObjectId(_id)}, add_stock).modified_count

    return {
        "status": "success",
        "message": "Stock added to watchlist",
        "modified_count": modify,
        "data": data,
    }


@v1.route("/watchlist/remove", methods=["POST"])
def remove_from_watchlist():
    stock_name = request.json.get("stock_name")
    _id = request.json.get("id")

    checks = [
        {"data": stock_name, "type": str, "var_name": "stock_name"},
        {"data": _id, "type": str, "var_name": "_id"},
    ]

    try:
        errors_handlers.isEmpty(checks)
        errors_handlers.isCorrectType(checks)
    except Exception as e:
        return {
            "status": "failure",
            "message": f"{e}",
        }

    remove_stock = {"$pull": {"watchlist": {"stock_name": stock_name}}}

    modify = user.update_user(_id, remove_stock, _db)

    return {
        "status": "success",
        "message": "Stock removed from watchlist",
        "modified": modify,
    }


@v1.route("/watchlist/get", methods=["GET"])
def get_watchlist():
    _id = request.args.get("user_id")
    checks = [{"data": _id, "type": str, "var_name": "_id"}]

    try:
        errors_handlers.isEmpty(checks)
        errors_handlers.isCorrectType(checks)
    except Exception as e:
        return {
            "status-code": 400,
            "status": "failure",
            "message": f"{e}",
        }

    try:
        watchlist = user.get_user_watchlist(_id, _db)
        return {
            "status-code": 200,
            "status": "success",
            "message": "Watchlist found in db",
            "watchlist": watchlist,
        }
    except Exception as e:
        return {
            "status-code": 400,
            "status": "failure",
            "message": f"{e}",
        }


@v1.route("/transactions/get", methods=["GET"])
def get_transactions():
    _id = request.args.get("user_id")
    checks = [{"data": _id, "type": str, "var_name": "_id"}]

    try:
        errors_handlers.isEmpty(checks)
        errors_handlers.isCorrectType(checks)
    except Exception as e:
        return {
            "status-code": 400,
            "status": "failure",
            "message": f"{e}",
        }

    try:
        transactions = user.get_user_transactions(_id, _db)
        return {
            "status-code": 200,
            "status": "success",
            "message": "Transactions found in db",
            "transactions": transactions,
        }
    except Exception as e:
        return {
            "status-code": 400,
            "status": "failure",
            "message": f"{e}",
        }


app.register_blueprint(v1)
