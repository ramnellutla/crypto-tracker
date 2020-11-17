from flask import Flask, request
from listings import listings
from globals import globals
import requests
app = Flask(__name__)


@app.route('/hello/<name>')
def hello(name):
    return 'Hello ' + name + '!'


@app.route('/listings/getListings')
def getListings():
    parameters = {
        'start': request.args.get('start'),
        'limit': request.args.get('limit'),
        'convert': request.args.get('convert'),
        'sort': request.args.get('sort'),
        'sort_dir': request.args.get('sort_dir')
    }
    return listings.getListings(parameters)


@app.route('/globals/getGlobalMetrics')
def getGlobalMetrics():
    parameters = {
        'convert': request.args.get('convert'),
    }
    return globals.getGlobalMetrics(parameters)
