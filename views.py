from flask import Blueprint, render_template, request, redirect, url_for
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



def add_user(username):
    password = generate_password(16)
    print("password: ", password)

    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
    conn.commit()
    cursor.close()
    conn.close()
    
    return password


def generate_password(length):
    lower = "qwertyuioplkjhgfdsazxcvbnm"
    upper = "QWERTYUIOPLKJHGFDSAZXCVBNM"
    numbers = "1234567890"
    string = lower + upper + numbers
    password = "".join(random.sample(string, length))
    return password


@views.route("/matchmaking")
def matchmaking():
    print(playersNames)
    return render_template("matchmaking.html", list=playersNames)


@views.route("/entry")
def entry():
    return render_template("entry.html")


@views.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = add_user(username)
        return redirect(url_for("views.key", password=password))
    return render_template("register.html")


@views.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password = request.form['password']
        
        conn = sqlite3.connect(database_path)
        cursor = conn.cursor()
        
        # Check if a user with the provided password exists
        cursor.execute('SELECT * FROM users WHERE password = ?', (password,))
        user = cursor.fetchone()
        
        if user:
            # User with the provided password exists, redirect to a success page
            return redirect(url_for("views.matchmaking"))
        else:
            # User with the provided password doesn't exist, redirect to a failure page
            return redirect(url_for("views.failure"))
        
        cursor.close()
        conn.close()

    return render_template("login.html")





@views.route("/key")
def key():
    password = request.args.get('password')
    return render_template("key.html", password=password)

