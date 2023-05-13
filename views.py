from flask import Blueprint, render_template, request, redirect
import gspread
import sqlite3
import random
from threading import Lock

views = Blueprint(__name__, "views")

sa_mmr = gspread.service_account("C:/Users/FrostingBunBun/Desktop/else/flask/credentials.json")
sh_mmr = sa_mmr.open("Leaderboards")
wks_mmr = sh_mmr.worksheet("Leaderboards")

playersNames = wks_mmr.get("D4:D")

database_path = 'C:/Users/FrostingBunBun/Desktop/else/flask/db/users.db'



def add_user():
    password = generate_password(16)
    print("password: ", password)


    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()
    if request.method == 'POST':
        username = request.form['username']
        # Insert the user into the database
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
    cursor.close()
    conn.close()


def generate_password(length):
    lower = "qwertyuioplkjhgfdsazxcvbnm"
    upper = "QWERTYUIOPLKJHGFDSAZXCVBNM"
    numbers = "1234567890"
    string = lower + upper + numbers
    password = "".join(random.sample(string, length))
    return password


@views.route("/players")
def get_players():
    print(playersNames)
    return render_template("names.html", list=playersNames)


@views.route("/entry")
def entry():
    return render_template("entry.html")


@views.route("/register", methods=['GET', 'POST'])
def register():
    print("Register function is called")
    if request.method == 'POST':
        username = request.form['username']
        print("==============")
        print("username: ", username)
        add_user()
        print("==============")
        return redirect("key")
    return render_template("register.html")


@views.route("/login")
def login():
    print("Login function is called")
    if request.method == 'POST':
        password = request.form['password']



    return render_template("login.html", methods=['GET', 'POST'])


@views.route("/key")
def key():
    password = request.args.get('password')
    return render_template("key.html")
