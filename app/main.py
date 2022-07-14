import logging
from flask import render_template, request
from app import app

from networktables import NetworkTables

logging.basicConfig(level=logging.DEBUG)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/send", methods=['POST'])
def send():
    try:
        NetworkTables.initialize(server="10.16.83.2")
        table = NetworkTables.getTable("titandrive")

        data = dict(request.get_json())

        table.putNumber("x", data["x"])
        table.putNumber("y", data["y"])
        table.putNumber("angle", data["angle"])
        table.putBoolean("shoot", data["shoot"])
        table.putBoolean("disabled", data["disabled"])

    except Exception as e:
        print(e)
    return 'OK', 200