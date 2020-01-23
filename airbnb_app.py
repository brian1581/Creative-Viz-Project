from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, redirect, jsonify
import getpass
from sqlalchemy import create_engine
import pandas as pd
import psycopg2 as pg
import json
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

connect_string = os.environ.get("DATABASE_URL")
# p = getpass.getpass(prompt="Password: ")
# rds_connection_string = f"postgres:{p}@localhost:5432/airbnb_db"
# engine = create_engine(f'postgresql://{rds_connection_string}')
# DATABASE_URL = "postgres://gtttqtxcivlqiv:2af955aeb6ab9bae63664bf73ab76e524ad55b3296e7c22e773536ed1d75f357@ec2-3-224-165-85.compute-1.amazonaws.com:5432/d4cjuuq2jmullg"
engine = create_engine(connect_string)






@app.route("/")
def home():
    
    
    return render_template("index.html")
    


@app.route("/data/airbnb")
def index():
    data = pd.read_sql("select * from airbnb_portland;", con=engine).to_json(index=False,orient="table")
    airbnb = json.loads(data)
   
    return jsonify(airbnb['data'])

@app.route("/data/rentals")
def rent():
    rent = pd.read_sql("select * from rentals;", con=engine).to_json(index=False,orient="table")
    rentals = json.loads(rent)
   
    return jsonify(rentals['data'])

@app.route("/data/listings")
def price():
    price = pd.read_sql("select * from listings;", con=engine).to_json(index=False,orient="table")
    listings = json.loads(price)
   
    return jsonify(listings['data'])

@app.route("/demo/airbnb")
def demo_index():
    data = pd.read_sql("select * from airbnb_portland limit 5;", con=engine).to_json(index=False,orient="table")
    airbnb = json.loads(data)
    
    return jsonify(airbnb['data'])

@app.route("/demo/rentals")
def demo_rent():
    rent = pd.read_sql("select * from rentals limit 5;", con=engine).to_json(index=False,orient="table")
    rentals = json.loads(rent)
    
    return jsonify(rentals['data'])

@app.route("/demo/listings")
def demo_price():
    price = pd.read_sql("select * from listings limit 5;", con=engine).to_json(index=False,orient="table")
    listings = json.loads(price)
    
    return jsonify(listings['data'])


if __name__ == "__main__":
    app.run(debug=True)

