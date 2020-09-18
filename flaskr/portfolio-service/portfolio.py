from flask import Flask, request, jsonify
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import requests
import json
from functools import wraps
import jwt

app = Flask(__name__)


f = open(r'..\secretKey.txt', 'r')
SECRET_KEY = f.read()


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'bearerToken' in request.headers:
            token = request.headers['bearerToken']

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY)
            current_user = data['username']

        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


@app.route('/api/getPortfolio')
@token_required
def getPortfolio(current_user):
    try:
        response = [{
            'asset': "BitCoin",
            'symbol': 'BTC',
            'amountOwned': 10,
            'value': 100,
            'price': 10,
            'percentChange1h': 0.23,
            'percentChange24h': 0.25,
            'percentchange7d': -0.12}]
        data = json.dumps(response)
        return data
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)
