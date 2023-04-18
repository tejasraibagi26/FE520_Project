
import json

import bcrypt
from bson import ObjectId, json_util

from api.Handlers import errors_handlers


def create_if_not_exists(collection_name: str, _db) -> None:
    if (_db.get_collection(collection_name) is None):
        _db.create_collection(collection_name)

    return None


def encrypt(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)


def add_user(user: dict, _db) -> dict:
    create_if_not_exists("user", _db)
    user_collection = _db.get_collection("user")
    res = user_collection.insert_one(user)

    if (res is None):
        raise Exception("Could not add user to database")

    return res


def get_user_by_email(email: str, password: str, _db) -> dict:
    create_if_not_exists("user", _db)
    user_collection = _db.get_collection("user")
    user = user_collection.find_one({"email": email})

    if (user is None):
        raise Exception("Could not find user with that email")

    try:
        errors_handlers.doesPasswordMatch(password, user["password"])
    except Exception as e:
        raise Exception(e)

    del user["password"]
    return user


def get_user_by_id(user_id: ObjectId, _db) -> dict:
    create_if_not_exists("user", _db)
    user_collection = _db.get_collection("user")
    user = user_collection.find_one({"_id": user_id})

    if (user is None):
        raise Exception("Could not find user with that id")

    del user["password"]
    return user


def get_stocks_from_user(user) -> list:
    return user["stocks"]


def update_user(_id: str, operations: dict, _db: any) -> bool:
    create_if_not_exists("user", _db)
    user_collection = _db.get_collection("user")

    update = user_collection.update_one(
        {'_id': ObjectId(_id)}, operations)

    print(update.acknowledged)
    if (update.modified_count == 0):
        raise Exception("Could not add stock to user")

    return True


def get_user_watchlist(_id: str, _db) -> list:
    try:
        user = get_user_by_id(ObjectId(_id), _db)
    except Exception as e:
        raise Exception(e)

    return user["watchlist"]


def get_user_transactions(_id: str, _db) -> list:
    try:
        user = get_user_by_id(ObjectId(_id), _db)
    except Exception as e:
        raise Exception(e)

    return user["transactions"]
