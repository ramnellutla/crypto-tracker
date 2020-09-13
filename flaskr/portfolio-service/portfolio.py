from flask import Flask, request
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import requests
import json
app = Flask(__name__)


@app.route('/api/getPortfolio')
def getPortfolio():
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
