# pip install flask-sqlalchemy
# pip install psycopg2

import psycopg2 as psycopg2
from flask_sqlalchemy import sqlalchemy
from sqlalchemy import create_engine
import numpy as np
from flask import Flask
import getpass
import os as os

pwd = getpass.getpass()

def get_postgres(database_url):
    try:
        return os.environ[database_url]
    except KeyError:
        message = "Expected environment variable '{}' not set.".format(database_url)
        raise Exception('Unable to connect to PG Admin database')

# the values of those depend on your setup
# pg_url = get_postgres("localhost:5432")
# pg_user = get_postgres("postgres")
# pg_pwd = get_postgres("pwd")
pg_db = "airbnb_db"

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'redis'
# app.config['SESSION_REDIS'] = REDIS_URL
# app.secret_key = get_postgres("SECRET_KEY")

# +psycopg2
# database_url = 'postgresql://{user}:{pw}@{url}/{db}'.format(user=pg_user,pw=pg_pwd,url=pg_url,db=pg_db)
database_url = create_engine(f'postgresql://postgres:{pwd}@localhost:5432/{pg_db}')

app.config['sqlalchemy_db_uri'] = database_url
app.config['sqlalchemy_track_mods'] = False # silence the deprecation warning

# db = sqlalchemy(app)

# class user(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     login_id = db.Column(db.String(200), unique=False, nullable=True)
#     login_token = db.Column(db.String(200), unique=False, nullable=True)

def load_user(user_id):
    return user.query.filter_by(login_id=user_id).first()

@app.cli.command('resetdb')
def db_reset():
    """Destroys and creates the database + tables."""

    from sqlalchemy_utils import database_exists, create_database, drop_database
    if database_exists(database_url):
        print('Deleting database.')
        drop_database(database_url)
    if not database_exists(database_url):
        print('Creating database.')
        create_database(database_url)

    print('We are creating the tables.')
    db.create_all()
    print("I'm so fancy!")

    sk_app=baa/main.py
    # flask resetdb

@app.route("/")
def start():
    # if not current_user.is_authenticated:
    #     # redirect to login
    #     return go_to()

    # d = get_data(current_user.login_token)
    return render_template("d3landing.html", **d)
@app.route("/current")
def current():
    d = get_data(current_user.login_token)
    return json.dumps(d)