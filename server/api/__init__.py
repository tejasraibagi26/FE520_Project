
from flask import Flask, Blueprint
from flask_cors import CORS

from api import db

_db = db.connect_to_db()
app = Flask(__name__)

v1 = Blueprint('v1', __name__, url_prefix='/api/v1')

app.config['CORS_HEADERS'] = 'Content-Type'

from api import routes
