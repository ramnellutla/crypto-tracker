from flask import Flask, request, abort, make_response, jsonify
import requests
import jwt
import datetime

app = Flask(__name__)

f = open(r'..\secretKey.txt', 'r')
secret = f.read()
user_name = ''
pass_word = ''


@app.route('/api/user/login', methods=['POST'])
def userLogin():
    data = request.get_json()
    print(user_name, pass_word)
    if(not data['username'] == 'admin' and not data['password'] == 'password'):
        abort(401)

    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    bearerToken = jwt.encode(
        {'username': data['username'], 'exp': expiry}, secret, algorithm='HS256')

    return jsonify({'bearerToken': bearerToken.decode('UTF-8'), 'expiry': expiry})


@app.route('/api/user/signup', methods=['POST'])
def signup():
    data = request.get_json()

    username = data['username']
    password = data['password']

    if(not username or not password):
        abort(400)

    user_name = username
    pass_word = password

    return jsonify({'result': True})


@app.errorhandler(401)
def custom_401(error):
    return make_response('Authentication Failed', 401, {'AuthenticationFailed': 'Basic realm="Login Required"'})


@app.errorhandler(400)
def custom_400(error):
    return make_response('Invaid data', 400, {'BadData': 'Basic realm="Invalid data"'})
