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
    url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
    }
    session = requests.session()
    session.headers.update(headers)
    try:
        parameters = {
            'convert': request.args.get('convert'),
            'symbol': request.args.get('symbol')
        }
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        return data
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)
