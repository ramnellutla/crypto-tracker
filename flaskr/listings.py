from flask import Flask
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import requests
import json
app = Flask(__name__)


@app.route('/')
def hello_world():
    url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    parameters = {
        'start': '1',
        'limit': '5000',
        'convert': 'USD'
    }
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
    }
    session = requests.session()
    session.headers.update(headers)
    try:
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        print(data)
        return data
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)
