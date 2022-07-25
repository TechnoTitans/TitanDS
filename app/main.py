import logging
from flask import render_template, request
from app import app

from networktables import NetworkTables

logging.basicConfig(level=logging.DEBUG)


@app.route("/")
def index():
    return render_template('index.html')

NetworkTables.initialize(server="10.16.83.2")
table = NetworkTables.getTable("titandrive")

@app.route("/drive", methods=['POST'])
def send():
    try:
        data = dict(request.get_json())
        print(data)

        table.putNumber("x", data["x"])
        table.putNumber("y", data["y"])

    except Exception as e:
        print(e)
    return 'OK', 200

@app.route("/shoot", methods=['POST'])
def send():
    try:
        data = dict(request.get_json())
        print(data)

        table.putBoolean("shoot", data["shoot"])

    except Exception as e:
        print(e)
    return 'OK', 200

@app.route("/tilt", methods=['POST'])
def send():
    try:
        data = dict(request.get_json())
        print(data)

        table.putNumber("tiltangle", data["tiltangle"])

    except Exception as e:
        print(e)
    return 'OK', 200

@app.route("/mode", methods=['POST'])
def send():
    try:
        data = dict(request.get_json())
        print(data)

        table.putBoolean("disabled", data["disabled"])

    except Exception as e:
        print(e)
    return 'OK', 200