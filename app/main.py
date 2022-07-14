import logging
from flask import render_template, request
from app import app

logging.basicConfig(level=logging.DEBUG)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/send", methods=['POST'])
def send():
    try:
        print(request.get_json())
    except Exception as e: print(e)
    return 'OK', 200