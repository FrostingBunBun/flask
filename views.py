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
from datetime import date, datetime, timedelta
from flask import jsonify, request
import difflib
from collections import defaultdict


import numpy as np
from scipy.interpolate import interp1d

views = Blueprint(__name__, "views")


sa_mmr = gspread.service_account("./credentials.json")
sh_mmr = sa_mmr.open("Leaderboards")
wks_mmr = sh_mmr.worksheet("Leaderboards")

playersNames = wks_mmr.get("D4:D")
flat_names = [item for sublist in playersNames for item in sublist]
# print(flat_names)
# print("======================")

playersMmr = wks_mmr.get("C4:C")
flat_mmrs = [item for sublist in playersMmr for item in sublist]
# print(flat_mmrs)
nameMmr_dict = {}

for i in range(len(flat_names)):
    nameMmr_dict[flat_names[i]] = flat_mmrs[i]

# print(nameMmr_dict)












database_path = './db/users.db'

def is_profile_public(username):
    # Retrieve the user profile based on the username and check the `public_profile` flag
    # Return True if the profile is public, False otherwise
    # Implement your logic to retrieve and check the user profile visibility here
    # For example, if you are using a database, you can query the user profile table/model
    # and check the value of the `public_profile` field for the given username
    return True  # Modify this based on your implementation


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('logged_in') or not session.get('confirmed'):
            return redirect(url_for('views.login'))

        # Retrieve the username from the URL parameter
        username = kwargs.get('username')

        if username == session.get('username') or is_profile_public(username):
            return f(*args, **kwargs)
        else:
            return render_template('unauthorized.html')

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

    #DB STUFF +====================
    # Connect to the SQLite database
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    # Retrieve all rows from the table
    cursor.execute("SELECT rowid FROM Matches")
    rows = cursor.fetchall()
    
    # Update the new column with sequential IDs
    # for index, row in enumerate(rows, start=1):
        # cursor.execute("UPDATE Matches SET match_id = ? WHERE rowid = ?", (index, row[0]))
    # Update the existing rows to shift their order


    # Commit the changes
    conn.commit()
    
    # Close the cursor and the database connection
    cursor.close()
    conn.close()


    #DB STUFF +====================


    # Connect to the databases
    conn1 = sqlite3.connect('user_dsAvis.db')
    conn2 = sqlite3.connect('./db/players_data.db')

    cursor1 = conn1.cursor()
    cursor2 = conn2.cursor()



    cursor2.execute("SELECT player_name, mmr, wins, losses FROM Players ORDER BY mmr DESC")
    player_data = cursor2.fetchall()
 
    flat_names = []
    mmr_fixed = []
    playersWinLose = []

    for name in player_data:
        flat_names.append(name[0])
        mmr_fixed.append(name[1])
        playersWinLose.append([str(name[2]), str(name[3])])
        
    
    



    print("==============================")
    



    # Create a list to store the avatar URLs
    avatar_urls = []

    # Iterate over the names and fetch the corresponding avatar URLs from dsLinks
    for name in player_data:
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






    

    winrate_list = []
    for player in playersWinLose:
        winrate = "{:.2f}".format((int(player[0]) / (int(player[0]) + int(player[1]))) * 100, 2) if int(player[0]) + int(player[1]) > 0 else 0

        winrate_list.append(winrate)



    nameMmr_dict = {}

    for i in range(len(flat_names)):

        nameMmr_dict[flat_names[i]] = mmr_fixed[i], winrate_list[i], avatar_urls[i]
    username = ''
    if 'username' in session:
        username = session['username']









    return render_template("leaderboards.html", username=username, my_dict=nameMmr_dict)


@views.route("/matchmaking", methods=['GET', 'POST'])
@login_required
@mod_required
def matchmaking():

    # =========================
    # =========================

    # Connect to the database
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()





    cursor.execute('SELECT player_name FROM Players ORDER BY mmr DESC')
    player_names = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT mmr FROM Players ORDER BY mmr DESC')
    mmr_values = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT total_matches FROM Players ORDER BY mmr DESC')
    total_matches_values = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT wins FROM Players ORDER BY mmr DESC')
    wins_values = [row[0] for row in cursor.fetchall()]
    cursor.execute('SELECT losses FROM Players ORDER BY mmr DESC')
    losses_values = [row[0] for row in cursor.fetchall()]
    

    # Commit the changes and close the connection
    conn.commit()
    conn.close()


    

    flat_names = player_names
    flat_mmrs = mmr_values
    
    playersWinLose = []
    for x in range(len(wins_values)):
        playersWinLose.append([str(wins_values[x]), str(losses_values[x])])



    winrate_list = []
    for player in playersWinLose:
        wins = int(player[0])
        losses = int(player[1])
        winrate = "{:.2f}".format((wins / (wins + losses)) * 100, 2) if wins + losses > 0 else 0
        winrate_list.append(winrate)


    # print(winrate_list)

    nameMmr_dict = {}

    for i in range(len(flat_names)):
        nameMmr_dict[flat_names[i]] = flat_mmrs[i], winrate_list[i]
    username = ''
    if 'username' in session:
        username = session['username']

    
    
    print("==========================")
    print(session.items())
    print("==========================")
    my_dict2 = nameMmr_dict
    return render_template("matchmaking.html", my_dict=nameMmr_dict, my_dict2=my_dict2, username=username)




@views.route('/autoMatch', methods=['POST'])
def autoMatch():
    playersList = request.get_json()  # Get the data sent from the client

    # DB STUFF==========================================================
    # Connect to the SQLite database
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()

    response_data = []  # Create an empty list to store the player data

    for name in playersList:
        # Fetch data from the database based on the name
        cursor.execute("SELECT mmr, wins, losses FROM Players WHERE player_name = ?", (name,))
        result = cursor.fetchone()

        if result:
            mmr, wins, losses = result

            # Calculate win rate
            total_matches = wins + losses
            win_rate = "{:.2f}".format((wins / total_matches) * 100 if total_matches > 0 else 0)

            # Create a response data object for each player
            response_data.append({
                'name': name,
                'mmr': mmr,
                'wins': wins,
                'losses': losses,
                'win_rate': win_rate
            })
        else:
            response_data.append({'name': name, 'message': 'Player not found'})

    # Close the database connection
    cursor.close()
    conn.close()
    # DB STUFF==========================================================

    return jsonify(response_data)  # Send a response back to the client





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

    jet = session['jet']
    print("FINAL JET: ", jet)
    

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Matches (
        playerLeft TEXT,
        playerRight TEXT,
        winner TEXT,
        loser TEXT,
        timestamp TEXT,
        duration INTEGER,
        shift INTEGER,
        plane TEXT
    )
''')

    cursor.execute("INSERT INTO Matches (playerLeft, playerRight, winner, loser, timestamp, duration, shift, plane) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
               (left_name, right_name, right_name, left_name, timestamp, duration, abs(shift), jet))



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

    
    jet = session['jet']
    print("FINAL JET: ", jet)

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Matches (
        playerLeft TEXT,
        playerRight TEXT,
        winner TEXT,
        loser TEXT,
        timestamp TEXT,
        duration INTEGER,
        shift INTEGER,
        plane TEXT
    )
''')

    cursor.execute("INSERT INTO Matches (playerLeft, playerRight, winner, loser, timestamp, duration, shift, plane) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
               (left_name, right_name, right_name, left_name, timestamp, duration, abs(shift), jet))



    conn.commit()
    conn.close()





    # Process the received data as needed
    # Example: Store the data in the database

    return {'message': 'Data received successfully'}



@views.route("/sendJet", methods=["POST"])
@login_required
@mod_required
def sendJet():

    selected_name = request.json.get("selectedName")

    session['jet'] = selected_name

    # print("Session Data AFTER:", session)
    # Return a response if necessary
    return "Name received and processed successfully."


@views.route("/matchmaking/match", methods=['GET', 'POST'])
@login_required
@mod_required
def match():

    

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
    # print("==========================")
    # print(session.items())
    # print("==========================")
    if 'username' in session:
        username = session['username']
    # print("==========================")
    # print(session.items())
    # print("==========================")
    
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
    username = ""
    if session.get('logged_in'):
        username = session.get('username', '')
        if session.get('mod'):
            mod = "MOD ACCOUNT"
        else:
            mod = ""
        return render_template("main_logged.html", username=username, mod=mod)
    else:
        return render_template("main.html")
    

@views.route('/stats')
@login_required
def profile_details():
    name = session['username']

    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

    # Execute the SELECT query with a WHERE clause to search for the name
    cursor.execute("SELECT avatar_url FROM dsLinks WHERE name=?", (name,))

    # Fetch the result (URL) from the query
    result = cursor.fetchone()

    # Check if a matching record was found
    if result:
        avatar_url = result[0]
    else:
        # No exact match found, use get_close_matches to find similar names
        cursor.execute("SELECT name FROM dsLinks")
        all_names = [row[0] for row in cursor.fetchall()]

        # Adjust the cutoff value as desired (e.g., 0.7 for a higher similarity threshold)
        close_matches = difflib.get_close_matches(name, all_names, cutoff=0.5)

        if close_matches:
            closest_name = close_matches[0]
            cursor.execute("SELECT avatar_url FROM dsLinks WHERE name=?", (closest_name,))
            closest_result = cursor.fetchone()
            avatar_url = closest_result[0] if closest_result else "https://my.catgirls.forsale/QukeB047.png"
        else:
            avatar_url = "https://my.catgirls.forsale/QukeB047.png"



    
    
    history = get_matches_by_player(name)

    if check_player_exists(name):
        lastMatch = history[-1]
        print(lastMatch)
    else:
        tempList = ("NaN", 'NaN', 'NaN', 'NaN', 'NaN', 'NaN', "NaN", "NaN")
        lastMatch = tempList


    player_data = get_wins_loses_mmr(name)
    print("--------------------------------")
    if player_data:
        wins, losses, mmr = player_data
        print(f"Player: {name}")
        print(f"Wins: {wins}")
        print(f"Losses: {losses}")
        print(f"MMR: {mmr}")
    else:
        print(f"Player '{name}' not found.")

# ------------------------------------------------------------------

    # Connect to the SQLite database
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    # Get the current date and the first day of the month
    current_date = datetime.now().date()
    first_day = datetime(current_date.year, current_date.month, 1)

    # Get the last registered date in the database
    query = "SELECT MAX(timestamp) FROM Matches"
    cursor.execute(query)
    last_registered = cursor.fetchone()[0].split('T')[0]

    # Calculate the number of days between the first day of the month and the last registered date
    num_days = (datetime.strptime(last_registered, "%Y-%m-%d") - first_day).days + 1

    # Initialize a list to store the number of games per day
    games_per_day = [0] * num_days

    # Retrieve game data from the database for a specific player
    query = "SELECT timestamp FROM Matches WHERE playerLeft = ? OR playerRight = ?"
    cursor.execute(query, (name, name))
    game_timestamps = cursor.fetchall()

    # Iterate over the game timestamps and update the games_per_day list
    for timestamp in game_timestamps:
        game_date = datetime.strptime(timestamp[0].split('T')[0], "%Y-%m-%d").date()
        day_index = (game_date - first_day.date()).days
        games_per_day[day_index] += 1

    # Close the database connection
    cursor.close()
    conn.close()
    print("////////////////////////////////////////////////")
    print(games_per_day)
    print("////////////////////////////////////////////////")


    conn3 = sqlite3.connect('./db/users.db')
    cursor3 = conn3.cursor()

    # Execute the SELECT query with a WHERE clause to search for the name
    cursor3.execute("SELECT is_public FROM users WHERE username=?", (name,))

    # Fetch the result (URL) from the query
    result = cursor3.fetchone()

    is_public = result[0]
    print(is_public)


    is_own_profile = True

    conn5 = sqlite3.connect('./db/users.db')
    cursor5 = conn5.cursor()
    
    cursor5.execute("SELECT is_public FROM users WHERE username = ?", (name,))
    result = cursor5.fetchone()
    
    # Check if the result is not None
    if result is not None:
        is_public = result[0]
        print(f"The value of 'is_public' for {name} is {is_public}.")
    else:
        is_public = 0  # Assign a default value of 0 when the username is not found
        print(f"No record found for {name}.")





    return render_template('stats.html', name=name, avatar_url=avatar_url, history=history, lastMatch=lastMatch, wins=wins, losses=losses, mmr=mmr, 
                           games_per_day=games_per_day, is_public=is_public, is_own_profile=is_own_profile)



@views.route('/register_username', methods=['POST'])
def process_username():
    data = request.get_json()
    username = data.get('username')
    
    # Perform actions with the received username
    # Example: Print the username
    print('Received username:', username)
    whole_list = wks_mmr.get("D4:D")
    if (wks_mmr.cell(4, 3).value == None):
        new_last_row = 4
    else:
        new_last_row = len(whole_list) + 4

    wks_mmr.update_cell(new_last_row, 4, username)
    wks_mmr.update_cell(new_last_row, 3, 600)
    wks_mmr.update_cell(new_last_row, 6, 0)
    wks_mmr.update_cell(new_last_row, 7, 0)

    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO Players (player_name, mmr, total_matches, wins, losses, startingMmr) VALUES (?, ?, ?, ?, ?, ?)", (username, 600, 0, 0, 0, 600))
    conn.commit()
    conn.close()



    
    # Return a response if needed
    return 'Username received'

# @views.route("/leaderboardRegister")
# def leaderboardRegister():

#     return render_template('registerLeaderboard.html')




@views.route('/getMatchesData', methods=['POST'])
def get_data():

    profile_player = request.json.get('profilePlayer')

    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    cursor.execute('SELECT playerLeft, playerRight, duration FROM Matches WHERE playerLeft = ? OR playerRight = ?', (profile_player, profile_player))
    rows = cursor.fetchall()

    data = defaultdict(list)
    for row in rows:
        player_left, player_right, duration = row
        if player_left == profile_player:
            data[player_right].append(duration)
        else:
            data[player_left].append(duration)

    formatted_data = []
    for opponent in data.keys():
        durations = data[opponent]
        average_duration = sum(durations) / len(durations)
        formatted_data.append([profile_player, opponent, int(average_duration)])

    conn.close()

    # print("DDDDDDAAAAAATTTTTTTTAAAAAA; ", formatted_data)

    return jsonify({'opponents': [item[1] for item in formatted_data], 'averageDurations': [item[2] for item in formatted_data]})



@views.route('/stats/<name>')
def profile_details_leaderboard(name):

    conn3 = sqlite3.connect('./db/players_data.db')
    cursor3 = conn3.cursor()

    cursor3.execute("SELECT * FROM Players WHERE player_name=?", (name,))
    result3 = cursor3.fetchone()

    if not result3:
        # Name found in the database
        print("Name exists NOT in the database.")
        return render_template('registerLeaderboard.html')


    conn3.close()

    

    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

    # Execute the SELECT query with a WHERE clause to search for the name
    cursor.execute("SELECT avatar_url FROM dsLinks WHERE name=?", (name,))

    # Fetch the result (URL) from the query
    result = cursor.fetchone()

    # Check if a matching record was found
    if result:
        avatar_url = result[0]
    else:
        # No exact match found, use get_close_matches to find similar names
        cursor.execute("SELECT name FROM dsLinks")
        all_names = [row[0] for row in cursor.fetchall()]

        # Adjust the cutoff value as desired (e.g., 0.7 for a higher similarity threshold)
        close_matches = difflib.get_close_matches(name, all_names, cutoff=0.5)

        if close_matches:
            closest_name = close_matches[0]
            cursor.execute("SELECT avatar_url FROM dsLinks WHERE name=?", (closest_name,))
            closest_result = cursor.fetchone()
            avatar_url = closest_result[0] if closest_result else "https://my.catgirls.forsale/QukeB047.png"
        else:
            avatar_url = "https://my.catgirls.forsale/QukeB047.png"


    history = get_matches_by_player(name)
    print("LENGTH OF THE HISTORY: ", len(history))

    if check_player_exists(name):
        lastMatch = history[-1]
        print(lastMatch)
    else:
        tempList = ("NaN", 'NaN', 'NaN', 'NaN', 'NaN', 'NaN', "NaN", "NaN")
        lastMatch = tempList


    player_data = get_wins_loses_mmr(name)
    print("--------------------------------")
    if player_data:
        wins, losses, mmr = player_data
        print(f"Player: {name}")
        print(f"Wins: {wins}")
        print(f"Losses: {losses}")
        print(f"MMR: {mmr}")
    else:
        print(f"Player '{name}' not found.")

    

# ------------------------------------------------------------------

    # Connect to the SQLite database
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    # Get the current date and the first day of the month
    current_date = datetime.now().date()
    first_day = datetime(current_date.year, current_date.month, 1)

    # Get the last registered date in the database
    query = "SELECT MAX(timestamp) FROM Matches"
    cursor.execute(query)
    last_registered = cursor.fetchone()[0].split('T')[0]

    # Calculate the number of days between the first day of the month and the last registered date
    num_days = (datetime.strptime(last_registered, "%Y-%m-%d") - first_day).days + 1

    # Initialize a list to store the number of games per day
    games_per_day = [0] * num_days

    # Retrieve game data from the database for a specific player
    query = "SELECT timestamp FROM Matches WHERE playerLeft = ? OR playerRight = ?"
    cursor.execute(query, (name, name))
    game_timestamps = cursor.fetchall()

    for timestamp in game_timestamps:
        game_date = datetime.strptime(timestamp[0].split('T')[0], "%Y-%m-%d").date()
        day_index = (game_date - first_day.date()).days
        if 0 <= day_index < len(games_per_day):
            games_per_day[day_index] += 1
        else:
            # Handle the case when day_index is out of range
            print(f"Invalid day_index: {day_index}")
            # print(f"Invalid Day: {}") 

    # Close the database connection
    cursor.close()
    conn.close()
    # print("////////////////////////////////////////////////")
    # print(games_per_day)
    # print("////////////////////////////////////////////////")


    sessionName = session.get('username')
    # print("PAGE NAME: ", name)
    # print("MY NAME: ", sessionName)
    if sessionName == name:
        is_own_profile = True
    else:
        is_own_profile = False



        

    
    conn5 = sqlite3.connect('./db/users.db')
    cursor5 = conn5.cursor()
    
    cursor5.execute("SELECT is_public FROM users WHERE username = ?", (name,))
    result = cursor5.fetchone()
    
    # Check if the result is not None
    if result is not None:
        is_public = result[0]
        print(f"The value of 'is_public' for {name} is {is_public}.")
    else:
        is_public = 0  # Assign a default value of 0 when the username is not found
        print(f"No record found for {name}.")


    # ------------------------------------------------------------------

    player_name = name

    streak_count, result = get_streak(player_name)
    if streak_count > 0:
        print(f"{player_name} has a {result} streak of {streak_count}")
    else:
        print(f"No streak found for {player_name}")

    return render_template('stats.html', name=name, avatar_url=avatar_url, history=history, lastMatch=lastMatch, wins=wins, losses=losses, mmr=mmr, 
                           games_per_day=games_per_day, is_own_profile=is_own_profile, is_public=is_public, streak_count=streak_count, result=result)



def get_streak(player_name):
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    # Retrieve the latest match ID
    cursor.execute("SELECT MAX(match_id) FROM Matches")
    latest_match_id = cursor.fetchone()[0]

    current_match_id = latest_match_id
    initial_result = None
    streak_count = 0

    # Find the first match involving the player
    while current_match_id is not None:
        cursor.execute("SELECT * FROM Matches WHERE match_id = ?", (current_match_id,))
        match_data = cursor.fetchone()

        # Check if match_data is None
        if match_data is None:
            break

        # Check if the player is involved in the match
        if player_name in [match_data[1], match_data[2]]:
            # Determine the initial result based on the player's name
            if match_data[3] == player_name:
                initial_result = 'win'
            elif match_data[4] == player_name:
                initial_result = 'lose'
            else:
                initial_result = None

            if initial_result is not None:
                break

        current_match_id -= 1

    if initial_result is None:
        conn.close()
        return 0, None

    # Count the streak
    while current_match_id is not None:
        cursor.execute("SELECT * FROM Matches WHERE match_id = ?", (current_match_id,))
        match_data = cursor.fetchone()

        # Check if match_data is None
        if match_data is None:
            break

        # Check if the player is involved in the match
        if player_name in [match_data[1], match_data[2]]:
            # Determine the current result based on the player's name
            if match_data[3] == player_name:
                current_result = 'win'
            elif match_data[4] == player_name:
                current_result = 'lose'
            else:
                current_result = None

            if current_result == initial_result:
                streak_count += 1
                current_match_id -= 1
            else:
                break

        else:
            current_match_id -= 1

    conn.close()
    return streak_count, initial_result


@views.route('/planes_data/<name>', methods=['GET'])
def planes_data(name):
    plane_data = get_planes_value(name)
    return jsonify(plane_data)





def get_progression_history(name):
    # Connect to the SQLite database
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    # Query the database for match results
    cursor.execute("SELECT playerLeft, playerRight, winner, shift, timestamp FROM Matches")
    matches = cursor.fetchall()

    mmr_data = []

    conn2 = sqlite3.connect('./db/players_data.db')
    cursor2 = conn2.cursor()

    cursor2.execute("SELECT startingMmr FROM Players WHERE player_name = ?", (name,))
    result = cursor2.fetchone()
    startingMmr = 600
    cursor2.execute("SELECT mmr FROM Players WHERE player_name = ?", (name,))
    currentMmr = cursor2.fetchone()[0]
    if result:
        startingMmr = result[0]
        print("Starting MMR:", startingMmr)
    else:
        print("Player not found")

    conn2.close()

    # Iterate over the matches to calculate MMR progression
    for match in matches:
        player_left, player_right, winner, shift, timestamp = match

        date_object = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
        formatted_date = date_object.strftime("%Y-%m-%d")

        if player_left == name:
            if winner == player_left:
                mmr_data.append({'date': formatted_date, 'mmr_change': shift, 'initial_mmr': startingMmr})
                startingMmr += shift
            else:
                mmr_data.append({'date': formatted_date, 'mmr_change': -shift, 'initial_mmr': startingMmr})
                startingMmr -= shift

        if player_right == name:
            if winner == player_right:
                mmr_data.append({'date': formatted_date, 'mmr_change': shift, 'initial_mmr': startingMmr})
                startingMmr += shift
            else:
                mmr_data.append({'date': formatted_date, 'mmr_change': -shift, 'initial_mmr': startingMmr})
                startingMmr -= shift

    conn.close()
    mmr_data.append({'Current MMR': currentMmr})
    print("000000000000000000000000000000000000000")
    print(mmr_data)
    print(type(mmr_data))  # Print the mmr_data list for debugging
    print("000000000000000000000000000000000000000")

    return mmr_data





@views.route('/progression/<name>', methods=['GET'])
def progression_data(name):
    mmr_data = get_progression_history(name)
    # print("myDATA: ", mmr_data)


    return jsonify(mmr_data)






def get_planes_value(name):

    # Connect to the SQLite database
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    # Execute the query to count occurrences of planes for the given name
    cursor.execute("""
        SELECT plane, COUNT(*) AS count
        FROM Matches
        WHERE playerLeft = ? OR playerRight = ?
        GROUP BY plane
    """, (name, name))

    # Fetch the results
    results = cursor.fetchall()

    # Create a list to store the game counts for each plane
    game_counts = []

    # Iterate over the results and append the game counts to the list in the same order as the planes
    planes = ["F-14", "F-18", "Viggen", "Mig-29", "Eurofighter"]  # Specify the order of planes
    for plane in planes:
        count = next((result[1] for result in results if result[0] == plane), 0)
        game_counts.append(count)

    print(game_counts)  # Output: [10, 5, 8, 12, 6]

    # Close the database connection
    conn.close()

    return(game_counts)




@views.route('/save', methods=['POST'])
def save_checkbox_value():
    data = request.get_json()
    is_public = data.get('isPublic')

    # Handle the Boolean value as needed
    if is_public:

        
        # Checkbox is checked
        # Perform appropriate actions
        print("Checkbox is checked")

        name = session['username']

        conn3 = sqlite3.connect('./db/users.db')
        cursor3 = conn3.cursor()

        # Execute the SELECT query with a WHERE clause to search for the name
        cursor3.execute("UPDATE users SET is_public = ? WHERE username = ?", (0, name,))

        conn3.commit()


    else:
        # Checkbox is unchecked
        # Perform appropriate actions
        print("Checkbox is unchecked")

        name = session['username']

        conn3 = sqlite3.connect('./db/users.db')
        cursor3 = conn3.cursor()

        # Execute the SELECT query with a WHERE clause to search for the name
        cursor3.execute("UPDATE users SET is_public = ? WHERE username = ?", (1, name,))

        conn3.commit()


    # Return a response if needed
    return 'Checkbox value received'


@views.route('/matches')
def matches_history():
    historyAll = get_all_matches()

    return render_template('matches.html', historyAll=historyAll)



def get_all_matches():
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    query = "SELECT match_id, playerLeft, playerRight, winner, loser, timestamp, duration, shift, plane FROM Matches"
    cursor.execute(query)
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    if results:
        return results
    else:
        return None


def check_player_exists(player_name):
    conn = sqlite3.connect('./db/matches_data.db')
    cursor = conn.cursor()

    query = "SELECT COUNT(*) FROM Matches WHERE playerLeft = ? OR playerRight = ?"
    cursor.execute(query, (player_name, player_name))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if result and result[0] > 0:
        return True
    else:
        return False




def get_wins_loses_mmr(player_name):
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()

    query = "SELECT wins, losses, mmr FROM Players WHERE player_name = ?"
    cursor.execute(query, (player_name,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if result:
        wins, losses, mmr = result
        return wins, losses, mmr
    else:
        return None

def get_matches_by_player(player_name, page=1, games_per_page=9999):
    conn = sqlite3.connect("./db/matches_data.db")
    cursor = conn.cursor()

    query = "SELECT * FROM Matches WHERE playerLeft = ? OR playerRight = ? LIMIT ? OFFSET ?;"
    offset = (page - 1) * games_per_page
    cursor.execute(query, (player_name, player_name, games_per_page, offset))
    matches = cursor.fetchall()

    # Convert date format for each match
    matches = [(match[0], match[1], match[2], match[3], match[4], convert_date(match[5]), match[6], match[7]) for match in matches]

    cursor.close()
    conn.close()
    
    return matches




def convert_date(date_str):
    datetime_obj = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    formatted_date = datetime_obj.strftime("%Y-%m-%d %H:%M:%S")
    return formatted_date



def setDefaultMmr():
        mmr_dict = {}

        for x in range(len(flat_names)):
            mmr_dict[flat_names[x]] = flat_mmrs[x]

        print(mmr_dict)


        conn2 = sqlite3.connect('./db/players_data.db')
        cursor2 = conn2.cursor()


        for name, mmr in mmr_dict.items():
            # Update MMR value in the database for the given player name
            query = "UPDATE Players SET startingMmr = ? WHERE player_name = ?;"
            cursor2.execute(query, (mmr, name))

        # Commit the changes and close the database connection
        conn2.commit()
        cursor2.close()
        conn2.close()





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

@views.route("/dbSync", methods=['POST'])
@login_required
@mod_required
def dbSync():


    print("calculate start")
    print("calculate start")
    print("calculate start")
    print("calculate start")

    # Connect to the database
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()
    # clone db stuff--------------------------------------------------------
    values = wks_mmr.get_all_values()

    player_names = [row[3] for row in values[3:] if row[3]]
    mmr_values = [row[2] for row in values[3:] if row[2]]
    total_matches_values = [row[9] for row in values[3:] if row[9]]
    wins_values = [row[5] for row in values[3:] if row[5]]
    losses_values = [row[6] for row in values[3:] if row[6]]
    print("++++++++++++++++++++++++++++")
    print("Player Names: ", player_names)
    print("MMR Values: ", mmr_values)
    print("Total Matches: ", total_matches_values)
    print("Wins: ", wins_values)
    print("Losses: ", losses_values)
    print("++++++++++++++++++++++++++++")
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
    # clone db stuff--------------------------------------------------------

    print("calculate end")
    print("calculate end")
    print("calculate end")
    print("calculate end")

    return "Sync complete"


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

    matching_results = difflib.get_close_matches(name, [result[0] for result in results], n=1, cutoff=0.5)

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


