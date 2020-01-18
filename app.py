from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, redirect
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

conn = pg.connect(f"dbname=airbnb_db port=5432 user=postgres password={p}")
cur = conn.cursor(cursor_factory=RealDictCursor)



@app.route("/")
def home():
    # airbnb = engine.execute("SELECT * FROM airbnb_portland").fetchall()
    data = pd.read_sql("select * from airbnb_portland limit 5;", con=engine).to_json(index=False,orient="table")
    cur.execute("select * from airbnb_portland limit 5;")
    airbnb = json.loads(data)
    # print(airbnb)
    print(airbnb)
    return render_template("index.html", vacation=airbnb['data'])


if __name__ == "__main__":
    app.run(debug=True)