from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
import gspread
import sqlite3
import random
from threading import Lock
from functools import wraps

views = Blueprint(__name__, "views")

sa_mmr = gspread.service_account("C:/Users/FrostingBunBun/Desktop/else/flask/credentials.json")
sh_mmr = sa_mmr.open("Leaderboards")
wks_mmr = sh_mmr.worksheet("Leaderboards")

playersNames = wks_mmr.get("D4:D")


range_str = "C4:D"
values = wks_mmr.range(range_str)
range_wr = "I4:I"
winrate = wks_mmr.range(range_wr)

cell_values = {}

for i in range(0, len(values), 2):
    name = values[i + 1].value
    value1 = values[i].value
    value2 = winrate[i // 2].value
    if name != "":
        cell_values[name] = [value1, value2]







test = wks_mmr.acell("I4").value



flat_names = [item for sublist in playersNames for item in sublist]

database_path = 'C:/Users/FrostingBunBun/Desktop/else/flask/db/users.db'


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in') or not session.get('confirmed'):
            return redirect(url_for('views.login'))
        return f(*args, **kwargs)
    return decorated_function



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


views.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@views.route("/matchmaking", methods=['GET', 'POST'])
@login_required
def matchmaking():
    # Initialize variables with default values for debugging
    playerMmr1 = "1"
    playerWinrate1 = "2"
    playerMmr2 = "3"
    playerWinrate2 = "4"

    if request.method == 'POST':

        data = request.get_json()
        playerName1 = data.get("playerName1send")
        playerName2 = data.get("playerName2send")
    
        playerMmr1 = cell_values[playerName1][0]
        playerWinrate1 = cell_values[playerName1][1]


        # print("Player 2 Name:", playerName2)
        playerMmr2 = cell_values[playerName2][0]
        playerWinrate2 = cell_values[playerName2][1]

        # print("Player 1 Name:", playerName1)
        # print("Player 1 MMr:", playerMmr1)
        # print("Player 1 Winrate:", playerWinrate1)

        # print("Player 2 Name:", playerName2)
        # print("Player 2 MMr:", playerMmr2)
        # print("Player 2 Winrate:", playerWinrate2)

    player_data = [playerMmr1, playerWinrate1, playerMmr2, playerWinrate2]

    return render_template("matchmaking.html", list=flat_names, player_info=player_data)






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
    incorrect_password = False
    not_confirmed = False

    if request.method == 'POST':
        password = request.form['password']
        
        conn = sqlite3.connect(database_path)
        cursor = conn.cursor()
        
        # Check if a user with the provided password exists
        cursor.execute('SELECT * FROM users WHERE password = ?', (password,))
        user = cursor.fetchone()
        
        if user:
            # User with the provided password exists
            if user[3] == 1:  # Assuming is_confirmed is at index 3 in the user tuple
                # Account is confirmed, set the session and redirect to the protected page
                session['logged_in'] = True
                session['confirmed'] = True
                return redirect(url_for("views.matchmaking"))
            else:
                # Account is not confirmed
                not_confirmed = True
                incorrect_password = False
        else:
            # Incorrect password
            incorrect_password = True
            not_confirmed = False

    return render_template("login.html", incorrect_password=incorrect_password, not_confirmed=not_confirmed)










@views.route("/key")
def key():
    password = request.args.get('password')
    return render_template("key.html", password=password)

