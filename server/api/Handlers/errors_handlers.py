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


def doesPasswordMatch(password, confirm_password):
    if password != confirm_password:
        raise Exception("Please check your email and password")
