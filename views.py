from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
import gspread
import sqlite3
import random
from threading import Lock
from functools import wraps
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from difflib import get_close_matches



views = Blueprint(__name__, "views")


sa_mmr = gspread.service_account("./credentials.json")
sh_mmr = sa_mmr.open("Leaderboards")
wks_mmr = sh_mmr.worksheet("Leaderboards")

playersNames = wks_mmr.get("D4:D")
flat_names = [item for sublist in playersNames for item in sublist]

playersMmr = wks_mmr.get("C4:C")
flat_mmrs = [item for sublist in playersMmr for item in sublist]

nameMmr_dict = {}

for i in range(len(flat_names)):
    nameMmr_dict[flat_names[i]] = flat_mmrs[i]

# print(nameMmr_dict)


# =========================================================================
# flags = wks_mmr.get("E4:E")
# Get the cell value

# =========================================================================










database_path = './db/users.db'


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in') or not session.get('confirmed'):
            return redirect(url_for('views.login'))
        return f(*args, **kwargs)
    return decorated_function

def mod_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        # Check if user is a moderator
        is_mod = session.get('mod')
        
        if not is_mod:
            return redirect(url_for('views.login'))
        
        return func(*args, **kwargs)
    
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

@views.route("/leaderboards", methods=['GET', 'POST'])
def leaderboards():




    # Connect to the databases
    conn1 = sqlite3.connect('user_dsAvis.db')
    conn2 = sqlite3.connect('./db/players_data.db')

    cursor1 = conn1.cursor()
    cursor2 = conn2.cursor()

    # Fetch the names from players_data.db in the desired order
    cursor2.execute("SELECT player_name FROM Players ORDER BY mmr DESC")
    names2 = cursor2.fetchall()

    # print("NAMES")
    # print(names)
    # print("NAMES")

    playersNames = wks_mmr.get("D4:D")
    names = [(item[0],) for item in playersNames]


    # print("NAMES2")
    # print(formatted_string)
    print("OLD: ", type(names2))
    print("NEW: ", type(names))
    # print("NAMES2")



    # Create a list to store the avatar URLs
    avatar_urls = []

    # Iterate over the names and fetch the corresponding avatar URLs from dsLinks
    for name in names:
        cursor1.execute("SELECT avatar_url, name FROM dsLinks")
        results = cursor1.fetchall()
        matched_names = get_close_matches(name[0], [result[1] for result in results], n=1, cutoff=0.5)

        if matched_names:
            matched_name = matched_names[0]
            result = next((result for result in results if result[1] == matched_name), None)
            if result:
                avatar_url = result[0]
                avatar_urls.append(avatar_url)
            else:
                avatar_urls.append("https://my.catgirls.forsale/QukeB047.png")
        else:
            avatar_urls.append("https://my.catgirls.forsale/QukeB047.png")


    # Close the database connections
    conn1.close()
    conn2.close()


    # print("+++++++++++++++++++++++++++++++++++")
    # print(avatar_urls)



    # print(avatar_urls)

    flat_names = [item for sublist in playersNames for item in sublist]

    playersMmr = wks_mmr.get("C4:C")
    flat_mmrs = [item for sublist in playersMmr for item in sublist]
    
    playersWinLose = wks_mmr.get("F4:G")
    # print(playersWinLose)

    winrate_list = []
    for player in playersWinLose:
        winrate = "{:.2f}".format((int(player[0]) / (int(player[0]) + int(player[1]))) * 100, 2) if int(player[0]) + int(player[1]) > 0 else 0

        winrate_list.append(winrate)
    # print(winrate_list)

    nameMmr_dict = {}

    for i in range(len(flat_names)):

        nameMmr_dict[flat_names[i]] = flat_mmrs[i], winrate_list[i], avatar_urls[i]
    username = ''
    if 'username' in session:
        username = session['username']









    return render_template("leaderboards.html", username=username, my_dict=nameMmr_dict)


@views.route("/matchmaking", methods=['GET', 'POST'])
@login_required
@mod_required
def matchmaking():
    # ===================================================

    # Connect to the database
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()

    # Get column values
    player_names = wks_mmr.col_values(4)[3:]
    mmr_values = wks_mmr.col_values(3)[3:]
    total_matches_values = wks_mmr.col_values(10)[3:]
    wins_values = wks_mmr.col_values(6)[3:]
    losses_values = wks_mmr.col_values(7)[3:]

    # Loop through the data
    for i in range(len(player_names)):
        player_name = player_names[i]
        mmr_str = mmr_values[i]
        total_matches_str = total_matches_values[i]
        wins_str = wins_values[i]
        losses_str = losses_values[i]

        # Check for empty cells
        if player_name and mmr_str and total_matches_str and wins_str and losses_str:
            mmr = int(mmr_str)
            total_matches = int(total_matches_str)
            wins = int(wins_str)
            losses = int(losses_str)

            # Check if the player already exists in the database
            cursor.execute('SELECT * FROM Players WHERE player_name = ?', (player_name,))
            existing_player = cursor.fetchone()

            if existing_player:
                # Player exists, update their information
                cursor.execute('''
                    UPDATE Players
                    SET mmr = ?, total_matches = ?, wins = ?, losses = ?
                    WHERE player_name = ?
                ''', (mmr, total_matches, wins, losses, player_name))
            else:
                # Player doesn't exist, insert a new row
                cursor.execute('''
                    INSERT INTO Players (player_name, mmr, total_matches, wins, losses)
                    VALUES (?, ?, ?, ?, ?)
                ''', (player_name, mmr, total_matches, wins, losses))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    # ===================================================
    
    playersNames = wks_mmr.get("D4:D")
    flat_names = [item for sublist in playersNames for item in sublist]

    playersMmr = wks_mmr.get("C4:C")
    flat_mmrs = [item for sublist in playersMmr for item in sublist]
    
    playersWinLose = wks_mmr.get("F4:G")
    # print(playersWinLose)

    winrate_list = []
    for player in playersWinLose:
        winrate = "{:.2f}".format((int(player[0]) / (int(player[0]) + int(player[1]))) * 100, 2) if int(player[0]) + int(player[1]) > 0 else 0

        winrate_list.append(winrate)
    print(winrate_list)

    nameMmr_dict = {}

    for i in range(len(flat_names)):
        nameMmr_dict[flat_names[i]] = flat_mmrs[i], winrate_list[i]
    username = ''
    if 'username' in session:
        username = session['username']
    
    print("==========================")
    print(session.items())
    print("==========================")
    return render_template("matchmaking.html", my_dict=nameMmr_dict, username=username)

@views.route('/process-data', methods=['POST'])
@login_required
@mod_required
def process_data():
    

    

    data = request.get_json()
    # Process the data in Python
    leftName = data['leftName']
    left_new_mmr = data['left_new_mmr']
    rightName = data['rightName']
    right_new_mmr = data['right_new_mmr']

    processed_data = f"{leftName}, {left_new_mmr}, {rightName}, {right_new_mmr} recieved"

    playerLeft_row = wks_mmr.cell(wks_mmr.find(leftName).row, 4).row
    playerRight_row = wks_mmr.cell(wks_mmr.find(rightName).row, 4).row
    print("===================================")
    print("leftName: ", leftName)
    print("leftMMR: ", left_new_mmr)
    print("playerLeft_row: ", playerLeft_row)
    print("rightName: ", rightName)
    print("rightMMR: ", right_new_mmr)
    print("playerRight_row: ", playerRight_row)
    print("===================================")

    wks_mmr.update_cell(playerLeft_row, 3, left_new_mmr)
    wks_mmr.update_cell(playerRight_row, 3, right_new_mmr)


    # Prepare the response
    response = {
        'result': processed_data
    }
    return jsonify(response)

@views.route('/leftWonProcess', methods=['POST'])
@login_required
@mod_required
def leftWonProcess():
    data = request.get_json()
    left_name = data['playerLeft']
    right_name = data['playerRight']
    winner = data['winner']
    loser = data['loser']
    timestamp = data['timestamp']
    duration = data['duration']
    shift = data['shift']
    print("OOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    print(left_name)
    print(right_name)
    print(winner)
    print(loser)
    print(timestamp)
    print(duration)
    print(shift)
    print("OOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

    playerLeft_row = wks_mmr.cell(wks_mmr.find(left_name).row, 4).row
    playerRight_row = wks_mmr.cell(wks_mmr.find(right_name).row, 4).row

    wks_mmr.update_cell(playerLeft_row, 6, int(wks_mmr.cell(playerLeft_row, 6).value) + 1)
    wks_mmr.update_cell(playerRight_row, 7, int(wks_mmr.cell(playerRight_row, 7).value) + 1)

    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Matches (
        playerLeft TEXT,
        playerRight TEXT,
        winner TEXT,
        loser TEXT,
        timestamp TEXT,
        duration INTEGER,
        shift INTEGER
    )
''')

    cursor.execute("INSERT INTO Matches (playerLeft, playerRight, winner, loser, timestamp, duration, shift) VALUES (?, ?, ?, ?, ?, ?, ?)",
               (left_name, right_name, left_name, right_name, timestamp, duration, abs(shift)))



    conn.commit()
    conn.close()





    # Process the received data as needed
    # Example: Store the data in the database

    return {'message': 'Data received successfully'}

@views.route('/rightWonProcess', methods=['POST'])
@login_required
@mod_required
def rightWonProcess():
    data = request.get_json()
    left_name = data['playerLeft']
    right_name = data['playerRight']
    winner = data['winner']
    loser = data['loser']
    timestamp = data['timestamp']
    duration = data['duration']
    shift = data['shift']
    print("OOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    print(left_name)
    print(right_name)
    print(winner)
    print(loser)
    print(timestamp)
    print(duration)
    print(shift)
    print("OOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

    playerLeft_row = wks_mmr.cell(wks_mmr.find(left_name).row, 4).row
    playerRight_row = wks_mmr.cell(wks_mmr.find(right_name).row, 4).row

    wks_mmr.update_cell(playerLeft_row, 7, int(wks_mmr.cell(playerLeft_row, 7).value) + 1)
    wks_mmr.update_cell(playerRight_row, 6, int(wks_mmr.cell(playerRight_row, 6).value) + 1)

    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Matches (
        playerLeft TEXT,
        playerRight TEXT,
        winner TEXT,
        loser TEXT,
        timestamp TEXT,
        duration INTEGER,
        shift INTEGER
    )
''')

    cursor.execute("INSERT INTO Matches (playerLeft, playerRight, winner, loser, timestamp, duration, shift) VALUES (?, ?, ?, ?, ?, ?, ?)",
               (left_name, right_name, right_name, left_name, timestamp, duration, abs(shift)))



    conn.commit()
    conn.close()





    # Process the received data as needed
    # Example: Store the data in the database

    return {'message': 'Data received successfully'}


@views.route("/matchmaking/match", methods=['GET', 'POST'])
@login_required
@mod_required
def match():

    # ===================================================

    # Connect to the database
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()

    # Get column values
    player_names = wks_mmr.col_values(4)[3:]
    mmr_values = wks_mmr.col_values(3)[3:]
    total_matches_values = wks_mmr.col_values(10)[3:]
    wins_values = wks_mmr.col_values(6)[3:]
    losses_values = wks_mmr.col_values(7)[3:]

    # Loop through the data
    for i in range(len(player_names)):
        player_name = player_names[i]
        mmr_str = mmr_values[i]
        total_matches_str = total_matches_values[i]
        wins_str = wins_values[i]
        losses_str = losses_values[i]

        # Check for empty cells
        if player_name and mmr_str and total_matches_str and wins_str and losses_str:
            mmr = int(mmr_str)
            total_matches = int(total_matches_str)
            wins = int(wins_str)
            losses = int(losses_str)

            # Check if the player already exists in the database
            cursor.execute('SELECT * FROM Players WHERE player_name = ?', (player_name,))
            existing_player = cursor.fetchone()

            if existing_player:
                # Player exists, update their information
                cursor.execute('''
                    UPDATE Players
                    SET mmr = ?, total_matches = ?, wins = ?, losses = ?
                    WHERE player_name = ?
                ''', (mmr, total_matches, wins, losses, player_name))
            else:
                # Player doesn't exist, insert a new row
                cursor.execute('''
                    INSERT INTO Players (player_name, mmr, total_matches, wins, losses)
                    VALUES (?, ?, ?, ?, ?)
                ''', (player_name, mmr, total_matches, wins, losses))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    # ===================================================
    

    # Clear the session variables to prevent reusing old values
    # print("SESSION ITEMS: ", session.items())
    confirmed = session.get('confirmed')


    print("CONFIRMED", confirmed)

    # Retrieve the stored variables from the session
    leftNAME = session.get('leftNAME')
    leftMMR = session.get('leftMMR')
    leftWINRATE = session.get('leftWINRATE')
    rightNAME = session.get('rightNAME')
    rightMMR = session.get('rightMMR')
    rightWINRATE = session.get('rightWINRATE')
    print("==========================")
    print(session.items())
    print("==========================")
    if 'username' in session:
        username = session['username']
    print("==========================")
    print(session.items())
    print("==========================")
    
    

    return render_template("match.html",
                           leftNAME=leftNAME,
                           leftMMR=leftMMR,
                           leftWINRATE=leftWINRATE,
                           rightNAME=rightNAME,
                           rightMMR=rightMMR,
                           rightWINRATE=rightWINRATE,
                           username=username)





@views.route("/processUserInfo/<string:userInfo>", methods=['POST'])
@login_required
@mod_required
def processUserInfo(userInfo):

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

    userInfo = json.loads(userInfo)
    print("USER INFO RECEIVED")
    leftNAME = userInfo['1name']
    rightNAME = userInfo['2name']
    leftMMR = cell_values[leftNAME][0]
    rightMMR = cell_values[rightNAME][0]
    leftWINRATE = cell_values[leftNAME][1]
    rightWINRATE = cell_values[rightNAME][1]

    print("==============================================")
    print("==============================================")

    # print(f"1 name: {leftNAME}")
    # print(f"1 mmr: {leftMMR}")
    # print(f"1 winrate: {leftWINRATE}")
    # print(f"2 name: {rightNAME}")
    # print(f"2 mmr: {rightMMR}")
    # print(f"2 winrate: {rightWINRATE}")
    # print("")
    # print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

    session.pop('leftMMR', None)
    session.pop('leftNAME', None)
    session.pop('leftWINRATE', None)
    session.pop('rightNAME', None)
    session.pop('rightMMR', None)
    session.pop('rightWINRATE', None)

    

    # Store the variables in the session
    session['leftNAME'] = leftNAME
    session['leftMMR'] = leftMMR
    session['leftWINRATE'] = leftWINRATE
    session['rightNAME'] = rightNAME
    session['rightMMR'] = rightMMR
    session['rightWINRATE'] = rightWINRATE


    # print("cell_values: ", cell_values)
    
    # Redirect to the 'match' route
    return redirect(url_for('views.match'))






@views.route("/test")
@login_required
@mod_required
def test():
    var = "DYN"
    return render_template("test.html", var=var)


@views.route("/main")
def main():
    print("==========================")
    print(session.items())
    print("==========================")
    if session.get('logged_in'):
        username = session['username']
        return render_template("main_logged.html", username=username)
    else:
        return render_template("main.html")
@views.route("/stats")
def stats():
    return render_template("stats.html")

@views.route("/matchmaking/match/processing")
@login_required
@mod_required
def processing():
    return render_template("processing.html")

@views.route("/matchmaking/match/processing/calculate")
@login_required
@mod_required
def calculate():
    return render_template("calculate.html")


@views.route("/")
def entry():
    if 'username' in session:
        return redirect(url_for("views.matchmaking"))
    else:
        return render_template("entry.html")


@views.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = add_user(username)
        return redirect(url_for("views.key", password=password))
    return render_template("register.html")

@views.route('/delete-item', methods=['POST'])
@login_required
@mod_required
def delete_item():
    key = request.json['key']
    if key in session:
        session.clear()
        return jsonify({'message': 'Item deleted successfully'})
    else:
        return jsonify({'message': 'Item not found in session'})

@views.route("/login", methods=['GET', 'POST'])
def login():

    incorrect_password = False
    not_confirmed = False
    print("==========================")
    print(session.items())
    print("==========================")
    session.pop('username', None)
    print("==========================")
    print(session.items())
    print("==========================")

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
                 # Retrieve and store the user's name in the session
                username = user[1]  # Assuming username is at index 1 in the user tuple
                session['username'] = username
                if user[4] == 1:
                    session['mod'] = True

                conn.close()  # Close the database connection
                return redirect(url_for("views.main"))
            else:
                # Account is not confirmed
                not_confirmed = True
                incorrect_password = False
        else:
            # Incorrect password
            incorrect_password = True
            not_confirmed = False

    return render_template("login.html", incorrect_password=incorrect_password, not_confirmed=not_confirmed)

from flask import jsonify, request
import difflib

@views.route('/avatar', methods=['POST'])
@login_required
@mod_required
def get_avatar():
    name = request.form['name']  # Get the name from the request data

    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

    cursor.execute("SELECT name, avatar_url FROM dsLinks")

    results = cursor.fetchall()

    conn.close()

    matching_results = difflib.get_close_matches(name, [result[0] for result in results], n=1)

    # print("TESTTTTTT: ", matching_results)

    if matching_results:
        matching_name = matching_results[0]
        for result in results:
            if result[0] == matching_name:
                avatar_url = result[1]
                return jsonify({'avatar_url': avatar_url})

    return jsonify({'error': 'User not found'})


@views.route('/left-avatar', methods=['POST'])
@login_required
@mod_required
def get_left_avatar():
    name = request.form['name']  # Get the name from the request data

    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

    cursor.execute("SELECT name, avatar_url FROM dsLinks")

    results = cursor.fetchall()

    conn.close()

    matching_results = difflib.get_close_matches(name, [result[0] for result in results], n=1, cutoff=0.1)

    # print("TESTTTTTT: ", matching_results)

    if matching_results:
        matching_name = matching_results[0]
        for result in results:
            if result[0] == matching_name:
                avatar_url = result[1]
                return jsonify({'avatar_url': avatar_url})

    return jsonify({'error': 'User not found'})







@views.route("/key")
def key():
    password = request.args.get('password')
    return render_template("key.html", password=password)

