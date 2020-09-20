from flask import Flask, request, abort, make_response, jsonify
import requests
import jwt
import datetime
import pymongo
from pymongo import MongoClient
import json
import sys
from cryptography.fernet import Fernet

app = Flask(__name__)

f = open(r'..\secretKey.txt', 'r')
secret = f.read()
user_name = ''
pass_word = ''

cipher_suite = Fernet(secret)

with open(r'..\dbConnections.json') as db_connections:
    dbData = json.load(db_connections)

cryptoTrackerConnectionString = dbData['cryptoTrackerConnectionString']
cluster = MongoClient(cryptoTrackerConnectionString)
cryptoTrackerDb = cluster['cryptoTracker']
userCollection = cryptoTrackerDb['user']


@ app.route('/api/user/login', methods=['POST'])
def userLogin():
    data = request.get_json()
    username = data['username']
    password = data['password']

    if(not username or not password):
        abort(400)

    userdata = userCollection.find_one({"username": username})

    if(userdata is None or not 'username' in userdata.keys()):
        abort(404)

    decipher_pwd = cipher_suite.decrypt(userdata['password']).decode('utf-8')

    if(not decipher_pwd == password):
        abort(401)

    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    bearerToken = jwt.encode(
        {'username': data['username'], 'exp': expiry}, secret, algorithm='HS256')

    return jsonify({'bearerToken': bearerToken.decode('UTF-8'), 'expiry': expiry})


@ app.route('/api/user/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data['username']
    password = data['password']
    ciphered_pwd = cipher_suite.encrypt(b"password")

    if(not username or not password):
        abort(400)

    try:
        post = {"username": username, "password": ciphered_pwd, "seetings": {}}
        userCollection.insert_one(post)
    except pymongo.errors.DuplicateKeyError:
        abort(409)
    except (AttributeError, pymongo.errors.OperationFailure):
        abort(500)
    return jsonify({'result': True})


@ app.errorhandler(401)
def custom_401(error):
    return make_response('Authentication Failed', 401, {'AuthenticationFailed': 'Basic realm="Login Required"'})


@ app.errorhandler(400)
def custom_400(error):
    return make_response('Invaid data', 400, {'BadData': 'Basic realm="Invalid data"'})


@ app.errorhandler(500)
def custom_500(error):
    return make_response(f'{error}', 500, {'ActionFailed': f'Basic realm={error}'})


@ app.errorhandler(409)
def custom_409(error):
    return make_response('DuplicateKey', 409, {'ActionFailed': f'Basic realm={error}'})


@ app.errorhandler(404)
def custom_404(error):
    return make_response('Not found', 404, {'NotFound': f'Basic realm={error}'})
