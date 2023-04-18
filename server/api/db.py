import pymongo


def connect_to_db():
    client = pymongo.MongoClient('localhost', 27017)
    db = client['fe520']
    return db
