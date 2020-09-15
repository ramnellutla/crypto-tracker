from flask import Flask, request
import requests

app = Flask(__name__)


@app.route('/api/user/login', methods=['POST'])
def userLogin():
    print(request)
    return "userLogin working"
