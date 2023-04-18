import datetime
import uuid

from bson import ObjectId, json_util
from flask import json, jsonify, request
from flask_cors import CORS, cross_origin

from api import _db, app, data, func

CORS(app)


@app.route("/")
def index():
    return "Hello, World!"


@app.route("/db_check")
def test():
    if (_db is not None):
        return f'Connected to db, {_db}'
    else:
        return "Not connected to db"


@app.route("/tickers", methods=['GET'])
def get_tickers():
    tickers = data.get_all_tickers()
    if (tickers):
        return {
            'data': tickers,
            'status': 'success',
        }

    return {
        'error': 'No tickers found'
    }


@app.route("/stock")
def get_stock_data():
    stock = request.args.get('stock_name')
    timeline = request.args.get('timeline')
    time_unit = request.args.get('time_unit')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    try:
        stock_data = data.get_stock_data(
            stock, timeline, time_unit, start_date, end_date)

        return {
            'data': stock_data
        }
    except Exception as e:
        return {
            'error': f'{e}'
        }


@app.route("/stock/yf", methods=['GET'])
def get_stock_yf():
    stock_name = request.args.get('stock_name')
    try:
        stock_data = data.get_stock_yf(stock_name)
        return {
            'data': stock_data,
            'status': 'success',
            'status-code': 200
        }
    except Exception as e:
        return {
            'status': 'failure',
            'status-code': 500,
            'error': f'{e}'
        }


@app.route("/auth/signup", methods=['POST'])
def add_user():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')
    conf_password = request.json.get('confPassword')

    if (password != conf_password):
        return {
            'status': 'failure',
            'message': 'Passwords do not match',
            'status-code': 400
        }

    try:
        func.create_if_not_exists("user", _db)
        # hash_password = func.encrypt(password)

        user = {'username': username, 'password': password, 'email': email, 'stocks': [],
                'watchlist': [], 'transactions': [], 'balance': 50.0}
        id = _db.user.insert_one(user).inserted_id
        return {
            'status': 'success',
            'message': 'User added to db with id: ' + str(id),
            'status-code': 200
        }
    except Exception as e:
        return {
            'status': 'failure',
            'message': f'{e}',
            'status-code': 500
        }


@app.route("/auth/login", methods=['POST'])
@cross_origin()
def get_user():
    email = request.json.get('email')
    password = request.json.get('password')

    user_db = _db.user.find_one({'email': email})
    if (user_db):
        user_val = json.loads(json_util.dumps(user_db))

        if (password != user_db["password"]):
            return {
                'status-code': 401,
                'status': 'failure',
                'message': 'Incorrect email or password'
            }
        del user_val['password']
        return {
            'status-code': 200,
            'status': 'success',
            'message': 'User found in db',
            'user': user_val
        }
    else:
        return {
            'status-code': 404,
            'status': 'failure',
            'message': 'User not found in db'
        }


@app.route("/user/stocks", methods=['GET'])
def get_user_stocks():
    user_id = request.args.get('user_id')
    user_db = _db.user.find_one({'_id': ObjectId(user_id)})
    if (user_db):
        user_val = json.loads(json_util.dumps(user_db))
        return {
            'status-code': 200,
            'status': 'success',
            'message': 'Stocks found',
            'stocks': user_val['stocks']
        }

    return {
        'status-code': 404,
        'status': 'failure',
        'message': 'User not found in db'
    }
    pass


@app.route("/trade/buy", methods=['POST'])
def buy_stock():
    # Get stock name, quantity, and price
    stock_name = request.json.get('stock_name')
    quantity = request.json.get('quantity')
    price = request.json.get('price')
    username = request.json.get('username')
    # Set time of transaction
    time = datetime.datetime.now()

    checks = [
        {
            'data': stock_name,
            'type': str,
            'var_name': 'stock_name'
        },
        {
            'data': quantity,
            'type': int,
            'var_name': 'quantity'
        },
        {
            'data': price,
            'type': float,
            'var_name': 'price'
        },
        {
            'data': username,
            'type': str,
            'var_name': 'username'
        },
        {
            'data': time,
            'type': datetime.datetime,
            'var_name': 'time'
        }
    ]

    try:
        func.isEmpty(checks)
        func.isCorrectType(checks)
    except Exception as e:
        return {
            'status': 'failure',
            'message': f'{e}',
        }

    add_stock = {"$push": {"stocks": {
        "stock_name": stock_name, "quantity": quantity, "price": price, "time": time, "type": "buy"},
        "transactions": {
        "transaction_id": str(uuid.uuid4()), "stock_name": stock_name, "quantity": quantity, "price": price, "time": time, "type": "buy"}
    }}

    print(add_stock)

    modify = _db.user.update_one(
        {'username': username}, add_stock).modified_count

    return {
        'status': 'success',
        'message': 'Stock bought',
        'modified_count': modify
    }

# Sell


@ app.route("/trade/sell", methods=['POST'])
def sell_stock():
    username = request.json.get('username')
    stock_name = request.json.get('stock_name')
    quantity = request.json.get('quantity')
    price = request.json.get('price')
    time = datetime.datetime.now()

    checks = [
        {
            'data': stock_name,
            'type': str,
            'var_name': 'stock_name'
        },
        {
            'data': quantity,
            'type': int,
            'var_name': 'quantity'
        },
        {
            'data': price,
            'type': float,
            'var_name': 'price'
        },
        {
            'data': username,
            'type': str,
            'var_name': 'username'
        },
        {
            'data': time,
            'type': datetime.datetime,
            'var_name': 'time'
        }
    ]

    try:
        func.isEmpty(checks)
        func.isCorrectType(checks)
    except Exception as e:
        return {
            'status': 'failure',
            'message': f'{e}',
        }

    # remove stock from stocks
    remove_stock = {"$pull": {"stocks": {
        "stock_name": stock_name, "quantity": quantity, "price": price, "time": time, "type": "buy"}}, "$push": {"transactions": {
            "transaction_id": str(uuid.uuid4()), "stock_name": stock_name, "quantity": quantity, "price": price, "time": time, "type": "sell"}}}

    modify = _db.user.update_one(
        {'username': username}, remove_stock).modified_count

    return {
        'status': 'success',
        'message': 'Stock sold',
        'modified_count': modify
    }


# Watchlist


@ app.route("/watchlist/add", methods=['POST'])
def add_to_watchlist():
    stock_name = request.json.get('stock_name')
    _id = request.json.get('id')

    added_time = datetime.datetime.now()

    data = {
        'stock_name': stock_name,
        'added_time': added_time
    }

    add_stock = {"$push": {"watchlist": data}}

    modify = _db.user.update_one(
        {'_id': ObjectId(_id)}, add_stock).modified_count

    return {
        'status': 'success',
        'message': 'Stock added to watchlist',
        'modified_count': modify,
        'data': data
    }


@ app.route("/watchlist/remove", methods=['POST'])
def remove_from_watchlist():
    stock_name = request.json.get('stock_name')
    _id = request.json.get('id')

    checks = [
        {
            'data': stock_name,
            'type': str,
            'var_name': 'stock_name'
        },
        {
            'data': _id,
            'type': str,
            'var_name': '_id'
        }
    ]

    try:
        func.isEmpty(checks)
        func.isCorrectType(checks)
    except Exception as e:
        return {
            'status': 'failure',
            'message': f'{e}',
        }

    remove_stock = {"$pull": {"watchlist": {
        'stock_name': stock_name}}}

    modify = _db.user.update_one(
        {'_id': ObjectId(_id)}, remove_stock).modified_count

    return {
        'status': 'success',
        'message': 'Stock removed from watchlist',
        'modified_count': modify
    }


@app.route("/watchlist/get", methods=['GET'])
def get_watchlist():
    user_id = request.args.get('user_id')
    checks = [
        {

            'data': user_id,
            'type': str,
            'var_name': 'user_id'
        }
    ]

    try:
        func.isEmpty(checks)
        func.isCorrectType(checks)
    except Exception as e:
        return {
            'status-code': 400,
            'status': 'failure',
            'message': f'{e}',
        }

    user_db = _db.user.find_one({'_id': ObjectId(user_id)})
    print(user_db)
    if (user_db):
        return {
            'status-code': 200,
            'status': 'success',
            'message': 'Watchlist found in db',
            'watchlist': user_db['watchlist']
        }
    else:
        return {
            'status-code': 400,
            'status': 'failure',
            'message': 'Watchlist not found in db',
        }


@ app.route("/transactions/get", methods=['GET'])
def get_transactions():
    user_id = request.args.get('user_id')
    checks = [
        {

            'data': user_id,
            'type': str,
            'var_name': 'user_id'
        }
    ]

    try:
        func.isEmpty(checks)
        func.isCorrectType(checks)
    except Exception as e:
        return {
            'status-code': 400,
            'status': 'failure',
            'message': f'{e}',
        }

    user_db = _db.user.find_one({'_id': ObjectId(user_id)})
    print(user_db)
    if (user_db):
        return {
            'status-code': 200,
            'status': 'success',
            'message': 'Transctions found in db',
            'transactions': user_db['transactions']
        }
    else:
        return {
            'status-code': 404,
            'status': 'failure',
            'message': 'Transctions not found in db',
        }
