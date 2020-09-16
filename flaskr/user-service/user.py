from flask import Flask, request, abort, make_response, jsonify
import requests
import jwt
import datetime

app = Flask(__name__)

f = open(r'..\secretKey.txt', 'r')
secret = f.read()


@app.route('/api/user/login', methods=['POST'])
def userLogin():
    data = request.get_json()

    if(not data['username'] == 'admin' and not data['password'] == 'password'):
        abort(401)

    bearerToken = jwt.encode(
        {'username': data['username'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, secret, algorithm='HS256')

    return jsonify({'bearerToken': bearerToken.decode('UTF-8')})


@app.errorhandler(401)
def custom_401(error):
    return make_response('Authentication Failed', 401, {'AuthenticationFailed': 'Basic realm="Login Required"'})
