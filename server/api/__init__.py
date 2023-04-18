
from flask import Flask
from flask_cors import CORS

from api import db

_db = db.connect_to_db()
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'



from api import routes
