from flask import Flask, request
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import requests
import json
app = Flask(__name__)


@app.route('/api/getlistings')
def getListings():
    url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
    }
    session = requests.session()
    session.headers.update(headers)
    try:
        parameters = {
            'start': request.args.get('start'),
            'limit': request.args.get('limit'),
            'convert': request.args.get('convert'),
            'sort': request.args.get('sort'),
            'sort_dir': request.args.get('sort_dir')
        }
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        return data
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)
