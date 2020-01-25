from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, redirect, jsonify
import getpass
from sqlalchemy import create_engine
import pandas as pd
import psycopg2 as pg
import json
from psycopg2.extras import RealDictCursor

app = Flask(__name__)


p = getpass.getpass(prompt="Password: ")
rds_connection_string = f"postgres:{p}@localhost:5432/airbnb_db"
engine = create_engine(f'postgresql://{rds_connection_string}')

# conn = pg.connect(f"dbname=airbnb_db port=5432 user=postgres password={p}")
# cur = conn.cursor(cursor_factory=RealDictCursor)



@app.route("/")
def home():
    
    return render_template("d3landing.html")


@app.route("/data/airbnb")
def index():
    data = pd.read_sql("select * from airbnb_portland;", con=engine).to_json(index=False,orient="table")
    airbnb = json.loads(data)
    
    return jsonify(airbnb['data'])

@app.route("/data/airbnb_rooms")
def rooms():
    data = pd.read_sql("select * from airbnb_room_tpyes;", con=engine).to_json(index=False,orient="table")
    rooms = json.loads(data)

    return jsonify(rooms['data'])

@app.route("/data/airbnb_mean_prices")
def mean_price():
    data = pd.read_sql("select * from airbnb_mean_prices;", con=engine).to_json(index=False,orient="table")
    rooms = json.loads(data)

    return jsonify(rooms['data'])

@app.route("/data/airbnb_reviews")
def reviews():
    data = pd.read_sql("select * from airbnb_reviews;", con=engine).to_json(index=False,orient="table")
    rooms = json.loads(data)

    return jsonify(rooms['data'])

@app.route("/data/price_by_day_of_week")
def reviews_DoW():
    data = pd.read_sql("select * from airbnb_price_by_day_of_week;", con=engine).to_json(index=False,orient="table")
    rooms = json.loads(data)

    return jsonify(rooms['data'])

@app.route("/data/airbnb_portland_mean_prices")
def portland_mean():
    data = pd.read_sql("select * from airbnb_portland_mean_price;", con=engine).to_json(index=False,orient="table")
    rooms = json.loads(data)

    return jsonify(rooms['data'])

@app.route("/data/rentals")
def rent():
    rent = pd.read_sql("select * from rentals;", con=engine).to_json(index=False,orient="table")
    rentals = json.loads(data)
  
    return jsonify(rentals['rent'])

@app.route("/data/listings")
def listings():
    price = pd.read_sql("select * from listings;", con=engine).to_json(index=False,orient="table")
    listings = json.loads(data)
 
    return jsonify(listings['price'])


if __name__ == "__main__":
    app.run(debug=True)

