from flask import Flask, jsonify, Response
from flask_cors import CORS
from models import Portfolio, History
from mongoengine import connect
from scan import run_scan
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

connect(host=os.getenv("MONGO_URI"))

@app.route("/scan", methods=["GET"])
def scan_stocks():
    print("running scan")
    run_scan()
    return Response(status=204)

@app.route("/data", methods=["GET"])
def hello():
    portfolio = list(
        Portfolio.objects()
        .only("symbol", "signal", "candle", "close", "entry", "stop_loss", "target", "link")
        .exclude("id")
        .as_pymongo()
        )
   
    history = list(
        History.objects()
        .only("symbol", "signal", "entry", "exit", "profit_loss", "link")
        .exclude("id")
        .as_pymongo()
        )
   
    return jsonify({"portfolio": portfolio, "history": history})

if __name__ == "__main__":
    app.run(debug=True)
