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
def sendDrive():
    try:
        data = dict(request.get_json())
        print(data)

        table.putNumber("x", data["x"])
        table.putNumber("y", data["y"])

        print(data["x"], data["y"])

    except Exception as e:
        print(e)
    return 'OK', 200


@app.route("/shoot", methods=['POST'])
def sendShoot():
    try:
        data = dict(request.get_json())
        print(data)

        table.putBoolean("shoot", data["shoot"])

        print(data["shoot"])

    except Exception as e:
        print(e)
    return 'OK', 200


@app.route("/tilt", methods=['POST'])
def sendTilt():
    try:
        data = dict(request.get_json())
        print(data)

        table.putNumber("tiltangle", data["tiltangle"])
        print(data["tiltangle"])

    except Exception as e:
        print(e)
    return 'OK', 200


@app.route("/mode", methods=['POST'])
def sendMode():
    try:
        data = dict(request.get_json())
        print(data)

        table.putBoolean("disabled", data["disabled"])
        print(data["disabled"])

    except Exception as e:
        print(e)
    return 'OK', 200
