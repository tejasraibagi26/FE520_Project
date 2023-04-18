
import bcrypt


def create_if_not_exists(collection_name, _db) -> None:
    if (_db.get_collection(collection_name) is None):
        _db.create_collection(collection_name)

    return None


def encrypt(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())


def check_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)


def isEmpty(data):
    # Data -> Array of Objects
    for val in data:
        if val.get("data") == "":
            raise Exception(
                f"Missing required parameters: {val.get('var_name')}")


# Check if data is of correcy type
def isCorrectType(data):
    # Data -> Array of Objects
    for val in data:
        if type(val.get("data")) != val.get("type"):
            raise Exception(
                f"Incorrect Type: Expected {(val.get('type'))} but got {type(val.get('data'))} for {val.get('var_name')}")
