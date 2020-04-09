import os
from flask import Flask
from flask_restful import Api
from flask_pymongo import PyMongo

UPLOAD_FOLDER = '/vol/web/media/'

app = Flask(__name__)
api = Api(app)
# app.secret_key = "secret key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Configure the MONGO_URI
# app.config["MONGO_URI"] = 'mongodb://' + os.environ['MONGODB_USERNAME'] + ':' + os.environ['MONGODB_PASSWORD'] + '@' + os.environ['MONGODB_HOSTNAME'] + ':27017/' + os.environ['MONGODB_DATABASE']

app.config["MONGO_URI"] = 'mongodb://mongodb:27017/' + os.environ['MONGODB_DATABASE']
mongo = PyMongo(app)

from app import views
