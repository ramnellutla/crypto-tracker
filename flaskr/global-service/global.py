from flask import Flask, request
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import requests
import json
app = Flask(__name__)


@app.route('/api/getGlobalMetrics')
def getGlobalMetrics():
    url = 'https://sandbox-api.coinmarketcap.com/v1/global-metrics/quotes/latest'
    headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
    }
    session = requests.session()
    session.headers.update(headers)
    try:
        parameters = {
            'convert': request.args.get('convert'),
        }
        response = session.get(url, params=parameters)
        data = json.loads(response.text)
        return data
    except (ConnectionError, Timeout, TooManyRedirects) as e:
        print(e)
