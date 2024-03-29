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
from flask import jsonify, request, Response
import difflib
from collections import defaultdict
import math
from flask_socketio import SocketIO, emit
import time
import threading
from actualDsBot import get_bot_instance
import numpy as np
from scipy.interpolate import interp1d
from discord.ext import commands
import discord

from socketio_instance import socketio  # Import the SocketIO instance


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



match_is_going = False





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
            print('qwe')

    return decorated_function



def mod_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        # Check if user is a moderator
        is_mod = session.get('mod')
        
        if not is_mod:
            return redirect(url_for('views.main'))
        
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
    # Create a list to store the avatar URLs
    avatar_urls = []
    
    # Iterate over the names and fetch the corresponding avatar URLs from dsLinks
    for name in player_data:
        # Assuming that name[0] contains the player's name as a string
        name_str = str(name[0])
    
        cursor1.execute("SELECT avatar_url, name FROM dsLinks")
        results = cursor1.fetchall()
    
        matched_names = get_close_matches(name_str, [str(result[1]) for result in results], n=1, cutoff=0.5)
    
        if matched_names:
            matched_name = matched_names[0]
            result = next((result for result in results if str(result[1]) == matched_name), None)
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

    keys_to_remove = ['leftMMR', 'leftNAME', 'leftWINRATE', 'rightMMR', 'rightNAME', 'rightWINRATE']
    for key in keys_to_remove:
        session.pop(key, None)


    # =========================
    # =========================

    # Connect to the database
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()


    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT UNIQUE,
        mmr INTEGER,
        total_matches INTEGER,
        wins INTEGER,
        losses INTEGER,
        startingMmr INTEGER DEFAULT 600
    )
''')


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

    # Connect to the database
    conn = sqlite3.connect('./db/players_data.db')
    cursor = conn.cursor()
    # Assuming the 'players' table has 'name' and 'mmr' columns
    name = username
    # Execute the SELECT query
    cursor.execute("SELECT mmr FROM Players WHERE player_name = ?", (name,))
    result = cursor.fetchone()
    mmr = None
    if result:
        mmr = result[0]
        print(f"The MMR for {name} is: {mmr}")
    else:
        print(f"No MMR found for {name}")
    # Close the database connection
    conn.close()

    if session.get('logged_in'):
        username = session.get('username', '')
        if session.get('mod'):

            is_mod = True
        else:

            is_mod = False

    # Connect to the SQLite database

    connection = sqlite3.connect('./db/current_match.db')
    cursor = connection.cursor()

    # Get a list of all tables in the database
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]

    # Delete all records from each table
    for table in tables:
        cursor.execute(f"DELETE FROM {table};")
        print(f"Deleted all records from table '{table}'.")

    # Commit the changes and close the connection
    connection.commit()
    connection.close()

    

    return render_template("matchmaking.html", my_dict=nameMmr_dict, 
                           my_dict2=my_dict2, username=username, 
                           mmr=mmr, is_mod=is_mod)




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

    print("processed_data: ", processed_data)

    playerLeft_row = wks_mmr.cell(wks_mmr.find(leftName).row, 4).row
    playerRight_row = wks_mmr.cell(wks_mmr.find(rightName).row, 4).row
    print("===================================")
    print("leftName: ", leftName)
    print("leftMMRnew: ", left_new_mmr)
    print("playerLeft_row: ", playerLeft_row)
    print("rightName: ", rightName)
    print("rightMMRnew: ", right_new_mmr)
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
    left_mmr = data['left_mmr']
    right_mmr = data['right_mmr']
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
    


    bot = get_bot_instance()

    if bot:
        channel_id = 1138618835319136336  # Replace with the channel ID
        channel = bot.get_channel(channel_id)


        print("leftWin")

    #     if channel:
    #         async def send_message():
    #             emb = discord.Embed(
    #             title = "Change is: " + str(abs(shift)),
    #             description = left_name + "({0})".format(left_mmr) + ": " + "**" + "+" + str(abs(shift)) + "**" + "\n" + right_name + "({0})".format(right_mmr) + ": " + "**" + "-" + str(abs(shift)) + "**" + "\n",
    #         colour = discord.Color.purple()
    #         )

    #             await channel.send(embed=emb)

    #         # Use bot.loop to run the asynchronous function
    #         bot.loop.create_task(send_message())



    #     else:
    #         return jsonify({"status": "Channel not found"})
    # else:
    #     return jsonify({"status": "Bot instance not available"})
    print("777777777777777777777777777777777777777777777777777777777777777 LEFT")
    cursor.execute("INSERT INTO Matches (playerLeft, playerRight, winner, loser, timestamp, duration, shift, plane) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
               (left_name, right_name, left_name, right_name, timestamp, duration, abs(shift), jet))



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
    left_mmr = data['left_mmr']
    right_mmr = data['right_mmr']
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


    bot = get_bot_instance()

    if bot:
        channel_id = 1138618835319136336  # Replace with the channel ID
        channel = bot.get_channel(channel_id)

        print("rightWin")

    #     if channel:
    #         async def send_message():
    #             emb = discord.Embed(
    #             title = "Change is: " + str(abs(shift)),
    #             description = right_name + "({0})".format(right_mmr) + ": " + "**" + "+" + str(abs(shift)) + "**" + "\n" + left_name + "({0})".format(left_mmr) + ": " + "**" + "-" + str(abs(shift)) + "**" + "\n",
    #             colour = discord.Color.purple()
    #         )

    #             await channel.send(embed=emb)

    #         # Use bot.loop to run the asynchronous function
    #         bot.loop.create_task(send_message())



    #     else:
    #         return jsonify({"status": "Channel not found"})
    # else:
    #     return jsonify({"status": "Bot instance not available"})
    print("777777777777777777777777777777777777777777777777777777777777777 RIGHT")
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


@views.route("/matchmaking/match/idle")
@login_required

def matchIdle():

    is_mod = session.get('mod') is not None

    return render_template("matchIdle.html", is_mod=is_mod)






def get_names_around(players, desired_name):
    if desired_name not in players:
        return []
    
    index = players.index(desired_name)
    start_index = max(0, index - 4)
    end_index = min(len(players), index + 4)
    names_around = players[start_index:end_index]
    return names_around

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
    # Check if '1name' and '2name' exist in userInfo dictionary and assign values accordingly, otherwise, use "noData"
    if '1name' in userInfo:
        leftNAME = userInfo['1name']
    else:
        leftNAME = "noData"
    
    if '2name' in userInfo:
        rightNAME = userInfo['2name']
    else:
        rightNAME = "noData"
    
    # Check if the names exist in cell_values dictionary and get their values, otherwise, use "noData"
    if leftNAME in cell_values:
        leftMMR = cell_values[leftNAME][0]
        leftWINRATE = cell_values[leftNAME][1]
    else:
        leftMMR = "noData"
        leftWINRATE = "noData"
    
    if rightNAME in cell_values:
        rightMMR = cell_values[rightNAME][0]
        rightWINRATE = cell_values[rightNAME][1]
    else:
        rightMMR = "noData"
        rightWINRATE = "noData"


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

    # avatarLeft = 

    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

  
    conn.close()


    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    conn = sqlite3.connect('./db/current_match.db')
    cursor = conn.cursor()

    cursor.execute('INSERT INTO Matches (nameLeft, nameRight, mmrLeft, mmrRight, winrateLeft, winrateRight, date) VALUES (?, ?, ?, ?, ?, ?, ?)', (
        leftNAME, rightNAME, leftMMR, rightMMR, leftWINRATE, rightWINRATE, current_time))
    conn.commit()
    conn.close()


    # print("cell_values: ", cell_values)
    
    # Redirect to the 'match' route
    return redirect(url_for('views.match'))





@views.route("/test")
@login_required
@mod_required
def test():
    var = "DYN"
    return render_template("test.html", var=var)




@views.route("/matchmaking/spectate")
def spectate():
    return render_template("spectate.html")


@views.route('/check_mod_status')
def check_mod_status():
    is_moderator = session.get('mod')
    return jsonify({'is_moderator': is_moderator})





@views.route("/main")
def main():
    print("==========================")
    print(session.items())
    print("==========================")
    username = ""
    mmr = ""  # Initialize mmr with a default value

    if session.get('logged_in'):
        username = session.get('username', '')
        if session.get('mod'):
            mod = "MOD ACCOUNT"
            is_mod = True
        else:
            mod = ""
            is_mod = False

        

        # Connect to the database
        conn = sqlite3.connect('./db/players_data.db')
        cursor = conn.cursor()

        # Assuming the 'players' table has 'name' and 'mmr' columns
        name = username

        # Execute the SELECT query
        cursor.execute("SELECT mmr FROM Players WHERE player_name = ?", (name,))
        result = cursor.fetchone()

        if result:
            mmr = result[0]
            print(f"The MMR for {name} is: {mmr}")
        else:
            print(f"No MMR found for {name}")

        # Close the database connection
        conn.close()







        conn = sqlite3.connect('./db/scrims.db')
        cursor = conn.cursor()

        # Create the table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Scrims (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            timestamp TEXT,
            plane TEXT
        )
        ''')

        # Fetch all rows from the "Scrims" table
        cursor.execute("SELECT id, date, timestamp, plane FROM Scrims")
        scrims_data = cursor.fetchall()

        conn.close()


 
        print("scrims_data: ", scrims_data)


        return render_template("main_logged.html", is_mod=is_mod, username=username, mod=mod, mmr=mmr, scrims_data=scrims_data)
    else:
        conn = sqlite3.connect('./db/scrims.db')
        cursor = conn.cursor()

        # Create the table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS Scrims (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            timestamp TEXT,
            plane TEXT
        )
        ''')

        # Fetch all rows from the "Scrims" table
        cursor.execute("SELECT id, date, timestamp, plane FROM Scrims")
        scrims_data = cursor.fetchall()

        conn.close()


 
        print("scrims_data: ", scrims_data)
        return render_template("main.html", scrims_data=scrims_data)
    



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
    cursor.execute("SELECT avatar_url FROM dsLinks WHERE name=?", (str(name),))  # Convert name to string
    
    # Fetch the result (URL) from the query
    result = cursor.fetchone()
    
    # Check if a matching record was found
    if result:
        avatar_url = result[0]
    else:
        # No exact match found, use get_close_matches to find similar names
        cursor.execute("SELECT name FROM dsLinks")
        all_names = [str(row[0]) for row in cursor.fetchall()]  # Convert elements to strings
    
        # Adjust the cutoff value as desired (e.g., 0.7 for a higher similarity threshold)
        close_matches = difflib.get_close_matches(str(name), all_names, cutoff=0.5)  # Convert name to string
    
        if close_matches:
            closest_name = close_matches[0]
            cursor.execute("SELECT avatar_url FROM dsLinks WHERE name=?", (closest_name,))
            closest_result = cursor.fetchone()
            avatar_url = closest_result[0] if closest_result else "https://my.catgirls.forsale/QukeB047.png"
        else:
            avatar_url = "https://my.catgirls.forsale/QukeB047.png"
    
    history = get_matches_by_player(str(name))  # Convert name to string
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

    if wins + losses == 0:
        winrate = 0  # Set winrate to 0 if there are no wins and losses
    else:
        winrate = round(wins / (wins + losses) * 100, 2)
    # print("winrate: ", winrate)
    # print("winrate TYPE: ", type(winrate)) 

    # print("111111111111111111111111")
    # print("HISTORY: ", history)
    # print("111111111111111111111111")


    page = request.args.get('page', default=1, type=int)
    items_per_page = 10  # Number of items to display per page

    total_items = len(history)  # Total number of items in your dataset
    total_pages = math.ceil(total_items / items_per_page)

    # print("PAGE: ", page)
    # print("total_items: ", total_items)
    # print("total_pages: ", total_pages)

    print("WINSSSSSSSSSSSSS: ", wins)
    print("LOSESSSSSSSSSSSSSSS: ", losses)

    return render_template('stats.html', name=name, avatar_url=avatar_url, history=history, lastMatch=lastMatch, wins=wins, losses=losses, mmr=mmr, page=page, total_pages=total_pages, 
                           items_per_page=items_per_page, games_per_day=games_per_day, is_own_profile=is_own_profile, is_public=is_public, streak_count=streak_count, result=result, 
                           winrate=winrate)



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
    # print(mmr_data)
    # print(type(mmr_data))  # Print the mmr_data list for debugging
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
    planes = ["F-14", "F-18", "Viggen", "Mig-29", "Eurofighter", "JAS_Gripen"]  # Specify the order of planes
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




import sqlite3

def get_wins_loses_mmr(player_name):
    old_db_conn = sqlite3.connect('./db/players_data.db')
    old_db_cursor = old_db_conn.cursor()

    new_db_conn = sqlite3.connect('./db/matches_data.db')
    new_db_cursor = new_db_conn.cursor()

    # Retrieve mmr from the old database
    mmr_query = "SELECT mmr FROM Players WHERE player_name = ?"
    old_db_cursor.execute(mmr_query, (player_name,))
    mmr_result = old_db_cursor.fetchone()

    if mmr_result:
        mmr = mmr_result[0]
    else:
        mmr = None

    # Retrieve wins and losses from the new database
    wins_query = "SELECT COUNT(*) FROM matches WHERE (playerLeft = ? OR playerRight = ?) AND winner = ?"
    new_db_cursor.execute(wins_query, (player_name, player_name, player_name))
    wins = new_db_cursor.fetchone()[0]

    losses_query = "SELECT COUNT(*) FROM matches WHERE (playerLeft = ? OR playerRight = ?) AND loser = ?"
    new_db_cursor.execute(losses_query, (player_name, player_name, player_name))
    losses = new_db_cursor.fetchone()[0]

    old_db_cursor.close()
    old_db_conn.close()

    new_db_cursor.close()
    new_db_conn.close()

    return wins, losses, mmr


def get_matches_by_player(player_name, page=1, games_per_page=9999):
    conn = sqlite3.connect("./db/matches_data.db")
    cursor = conn.cursor()

    query = "SELECT * FROM Matches WHERE playerLeft = ? OR playerRight = ? LIMIT ? OFFSET ?;"
    offset = (page - 1) * games_per_page
    cursor.execute(query, (player_name, player_name, games_per_page, offset))
    matches = cursor.fetchall()

    # Convert date format for each match
    matches = [(match[0], match[1], match[2], match[3], match[4], convert_date(match[5]), match[6], match[7], match[8]) for match in matches]

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

def get_avatar():
    name = request.form['name']  # Get the name from the request data

    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

    cursor.execute("SELECT name, avatar_url FROM dsLinks")

    results = cursor.fetchall()

    conn.close()

    matching_results = difflib.get_close_matches(name, [str(result[0]) for result in results], n=1, cutoff=0.5)


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

def get_left_avatar():
    name = request.form['name']  # Get the name from the request data

    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

    cursor.execute("SELECT name, avatar_url FROM dsLinks")

    results = cursor.fetchall()

    conn.close()

    matching_results = difflib.get_close_matches(name, [str(result[0]) for result in results], n=1, cutoff=0.5)

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





@views.route('/process-password', methods=['POST'])
def process_password():
    data = request.get_json()
    current_pwd = data['currentPwd']
    new_pwd = data['newPwd']
    confirm_pwd = data['confirmPwd']
    nickname = data['nickname']

    try:
        # Connect to the SQLite database
        conn = sqlite3.connect('./db/users.db')

        # Create a cursor object to execute SQL queries
        cursor = conn.cursor()

        # Execute a SELECT query to check if the password exists in the database
        cursor.execute("SELECT COUNT(*) FROM users WHERE password=?", (current_pwd,))
        result = cursor.fetchone()

        if result[0] > 0:
            print("Password exists in the database!")
            if current_pwd == confirm_pwd:
                print("Password Match")
                cursor.execute("UPDATE users SET password=? WHERE username=?", (new_pwd, nickname))
                resultEnd = "success"
            else:
                print("Password NOT Match")
                resultEnd = "password_not_match"
        else:
            print("Password does not exist in the database.")
            resultEnd = "user_not_found"

        # Commit the changes to the database
        conn.commit()

    except Exception as e:
        print("An error occurred:", str(e))
        resultEnd = "error"

    finally:
        # Close the cursor and the database connection
        cursor.close()
        conn.close()

    print("nickname: ", nickname)
    print("current_pwd: ", current_pwd)
    print("new_pwd: ", new_pwd)
    print("confirm_pwd: ", confirm_pwd)

    # Return the result as a JSON response
    return jsonify(resultEnd=resultEnd)

@views.route('/clear-database', methods=['POST'])
def clear_database():
    if request.method == 'POST':
        # Connect to the SQLite database
        conn = sqlite3.connect('./db/current_match.db')
        cursor = conn.cursor()

        # Execute the SQL query to delete all records from the database table
        cursor.execute('DELETE FROM Matches;')

        # Commit the changes and close the connection
        conn.commit()
        conn.close()


    




    data = request.get_json()
    playerLeft = data.get('playerLeft')  # Match the key names
    left_mmr = data.get('left_mmr')        # Match the key names
    playerRight = data.get('playerRight')  # Match the key names
    right_mmr = data.get('right_mmr')        # Match the key names
    print(f"Left Name: {playerLeft}, Left MMR: {left_mmr}")
    print(f"Right Name: {playerRight}, Right MMR: {right_mmr}")
    # bot = get_bot_instance()

    # if bot:
    #     channel_id = 1138618835319136336  # Replace with the channel ID
    #     channel = bot.get_channel(channel_id)
    #     print("cancel")
    #     if channel:
    #         async def send_message():
    #             emb = discord.Embed(
    #             title = "CANCELED:",
    #             description = "**{0}** ({2})\nVS\n**{1}** ({3})".format(playerLeft, playerRight, left_mmr, right_mmr),  
    #             colour = discord.Color.red(),
    #         )
    #             await channel.send(embed=emb)

    #         # Use bot.loop to run the asynchronous function
    #         bot.loop.create_task(send_message())



    #     else:
    #         return jsonify({"status": "Channel not found"})
    # else:
    #     return jsonify({"status": "Bot instance not available"})



    return jsonify({'message': 'Invalid request'})







@views.route("/bimba")
def bimba():


    return render_template("bimba.html")


@views.route("/matchmaking/match", methods=['GET', 'POST'])
@login_required
# @mod_required
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


    is_mod = session.get('mod') is not None



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


    playersWinLose = []
    for x in range(len(wins_values)):
        playersWinLose.append([str(wins_values[x]), str(losses_values[x])])

    winrate_list = []
    for player in playersWinLose:
        wins = int(player[0])
        losses = int(player[1])
        winrate = "{:.2f}".format((wins / (wins + losses)) * 100, 2) if wins + losses > 0 else 0
        winrate_list.append(winrate)

    nameMmr_dict = {}
    

    print(len(player_names), len(mmr_values), len(winrate_list))
    print("NAMES: ", player_names)
    print(len(player_names))
    print("000000000000000000000000000000000")
    print("MMRS: ", mmr_values)
    print(len(mmr_values))
    print("000000000000000000000000000000000")
    print("WINRATES: ", winrate_list)
    print(len(winrate_list))


    for i in range(len(player_names)):
        nameMmr_dict[player_names[i]] = mmr_values[i], winrate_list[i]

    names_around_left = get_names_around(player_names, leftNAME)
    names_around_right = get_names_around(player_names, rightNAME)
    print("LEFT NAME: ", leftNAME)
    print("RIGHT NAME: ", rightNAME)
    print("111111111111111: ", names_around_left)
    print("222222222222222: ", names_around_right)




    

    conn = sqlite3.connect('./db/current_match.db')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nameLeft TEXT,
        nameRight TEXT,
        mmrLeft INTEGER,
        mmrRight INTEGER,
        winrateLeft REAL,
        winrateRight REAL,
        date TEXT
    )
    ''')
    conn.commit()
    conn.close()







    
    
    return render_template("match.html",
                           leftNAME=leftNAME,
                           leftMMR=leftMMR,
                           leftWINRATE=leftWINRATE,
                           rightNAME=rightNAME,
                           rightMMR=rightMMR,
                           rightWINRATE=rightWINRATE,
                           username=username, is_mod=is_mod,
                           my_dict=nameMmr_dict,
                           names_around_left=names_around_left,
                           names_around_right=names_around_right)








# In-memory data store to simulate ongoing match updates
ongoing_match = {
    "status": "Idle",
    "name_left": None,
    "name_right": None,
    "mmr_left": None,
    "mmr_right": None,
    "winrate_left": None,
    "winrate_right": None,
    "date": None,
}


@views.route("/wst")
def wst():
    # Emit the request to update match status
    socketio.emit('request_match_status')

    return render_template("webSocketTest.html")

def generate_match_events():
    while True:

        conn = sqlite3.connect('./db/current_match.db')
        cursor = conn.cursor()

        # Replace this query with your actual database query to retrieve match data
        cursor.execute('SELECT id, nameLeft, nameRight, mmrLeft, mmrRight, winrateLeft, winrateRight, date FROM Matches ORDER BY id DESC LIMIT 1;')
        row = cursor.fetchone()
        conn.close()

        # Check if there are any matches in the database and update the status accordingly
        if row:
            ongoing_match["status"] = "Ongoing"
            (
                ongoing_match["id"],
                ongoing_match["nameLeft"],
                ongoing_match["nameRight"],
                ongoing_match["mmrLeft"],
                ongoing_match["mmrRight"],
                ongoing_match["winrateLeft"],
                ongoing_match["winrateRight"],
                ongoing_match["date"],
            ) = row
        else:
            ongoing_match["status"] = "Idle"
            # If there is no match data, set default values
            (
                ongoing_match["id"],
                ongoing_match["nameLeft"],
                ongoing_match["nameRight"],
                ongoing_match["mmrLeft"],
                ongoing_match["mmrRight"],
                ongoing_match["winrateLeft"],
                ongoing_match["winrateRight"],
                ongoing_match["date"],
            ) = None, None, None, None, None, None, None, None

        # Create a dictionary containing all the match data fields
        match_data = {
            "status": ongoing_match["status"],
            "nameLeft": ongoing_match["nameLeft"],
            "nameRight": ongoing_match["nameRight"],
            "mmrLeft": ongoing_match["mmrLeft"],
            "mmrRight": ongoing_match["mmrRight"],
            "winrateLeft": ongoing_match["winrateLeft"],
            "winrateRight": ongoing_match["winrateRight"],
            "date": ongoing_match["date"],
        }

        # Emit the match data to connected WebSocket clients
        emit('match_status', match_data, broadcast=True)

        time.sleep(1)









@views.route('/addScrim', methods=['POST'])
def add_scrim():
    # # Get data from the request body
    # data = request.json
    # scrim_date = data.get('scrim_date')

    # Get data from the request body
    data = request.json
    scrim_datetime = data.get('scrim_datetime')  # This now includes the selected time
    timezone = data.get('timezone')
    plane = data.get('plane')
    print("DATA: ", data)
    print("SCRIM_DATETIME: ", scrim_datetime)
    print("timezone: ", timezone)
    print("plane: ", plane)
    # Parse the input datetime string to a datetime object
    dt_object = datetime.strptime(scrim_datetime, '%Y-%m-%dT%H:%M:%S')

    # Convert the datetime object to the desired format
    formatted_datetime = dt_object.strftime('%Y-%m-%d %H:%M:%S')



    # Get current date and time in the 'YYYY-MM-DD HH:MM:SS' format
    current_datetime = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    conn = sqlite3.connect('./db/scrims.db')
    cursor = conn.cursor()


    # Insert the data into the table using a parameterized query
    cursor.execute("INSERT INTO Scrims (plane, date, timestamp) VALUES (?, ?, ?)", (plane, formatted_datetime, current_datetime))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Scrim added successfully.'}), 201




@views.route('/deleteScrim/<int:scrim_id>', methods=['DELETE'])
def delete_scrim(scrim_id):
    print("RECIEVED SCRIM ID: ", scrim_id)
    try:
        conn = sqlite3.connect('./db/scrims.db')
        cursor = conn.cursor()

        # Delete the record with the given ID from the "Scrims" table
        cursor.execute("DELETE FROM Scrims WHERE id = ?", (scrim_id,))
        conn.commit()

        conn.close()

        return jsonify({'message': 'Scrim deleted successfully'})
    except Exception as e:
        return jsonify({'message': 'An error occurred while deleting the scrim'}), 500


@views.route('/send-discord-message', methods=['POST'])
def send_discord_message():
    data = request.get_json()
    playerLeft = data.get('playerLeft')  # Match the key names
    left_mmr = data.get('mmrLeft')        # Match the key names
    playerRight = data.get('playerRight')  # Match the key names
    right_mmr = data.get('mmrRight')        # Match the key names
    print(f"Left Name: {playerLeft}, Left MMR: {left_mmr}")
    print(f"Right Name: {playerRight}, Right MMR: {right_mmr}")
    # bot = get_bot_instance()

    # if bot:
    #     channel_id = 1138618835319136336  # Replace with the channel ID
    #     channel = bot.get_channel(channel_id)

    #     print("created")

    #     if channel:
    #         async def send_message():
    #             # Extracting only the name from playerLeft and playerRight
    #             left_name = playerLeft.split("\n")[0]
    #             right_name = playerRight.split("\n")[0]
    #             emb = discord.Embed(
    #                 title="Currently Playing:",
    #                 description="**{0}** ({2})\nVS\n**{1}** ({3})".format(left_name, right_name, left_mmr, right_mmr),
    #                 colour=discord.Color.blurple()
    #             )

    #             await channel.send(embed=emb)

    #         # Use bot.loop to run the asynchronous function
    #         bot.loop.create_task(send_message())



    #     else:
    #         return jsonify({"status": "Channel not found"})
    # else:
    #     return jsonify({"status": "Bot instance not available"})

    return jsonify({"status": "Message sent to Discord channel!"})




# SSE endpoint
@views.route('/sseTest')
def sse():
    def event_stream():
        # Simulate sending SSE events (replace with your data)
        for i in range(10):
            yield 'data: {}\n\n'.format(i)
            time.sleep(1)

    return Response(event_stream(), content_type='text/event-stream')












def get_match_data():
    # Replace this with your actual data retrieval mechanism from the database
    # For demo purposes, we'll use SQLite to fetch data from the database.
    # Adjust the database path and query as per your actual database setup.
    conn = sqlite3.connect('./db/current_match.db')
    cursor = conn.cursor()

    # Replace this query with your actual database query to retrieve match data
    cursor.execute('SELECT id, nameLeft, nameRight, mmrLeft, mmrRight, winrateLeft, winrateRight, date FROM Matches ORDER BY id DESC LIMIT 1;')
    row = cursor.fetchone()
    conn.close()

    # Check if there are any matches in the database and update the status accordingly
    if row:
        ongoing_match["status"] = "Ongoing"
        (
            ongoing_match["id"],
            ongoing_match["nameLeft"],
            ongoing_match["nameRight"],
            ongoing_match["mmrLeft"],
            ongoing_match["mmrRight"],
            ongoing_match["winrateLeft"],
            ongoing_match["winrateRight"],
            ongoing_match["date"],
        ) = row
    else:
        ongoing_match["status"] = "Idle"
        # If there is no match data, set default values
        (
            ongoing_match["id"],
            ongoing_match["nameLeft"],
            ongoing_match["nameRight"],
            ongoing_match["mmrLeft"],
            ongoing_match["mmrRight"],
            ongoing_match["winrateLeft"],
            ongoing_match["winrateRight"],
            ongoing_match["date"],
        ) = None, None, None, None, None, None, None, None

    # Create a dictionary containing all the match data fields
    match_data = {
        "status": ongoing_match["status"],
        "nameLeft": ongoing_match["nameLeft"],
        "nameRight": ongoing_match["nameRight"],
        "mmrLeft": ongoing_match["mmrLeft"],
        "mmrRight": ongoing_match["mmrRight"],
        "winrateLeft": ongoing_match["winrateLeft"],
        "winrateRight": ongoing_match["winrateRight"],
        "date": ongoing_match["date"],
    }

    return match_data




# Custom event handler to send match status data
@socketio.on('match_status')
def handle_match_status():
    match_data = get_match_data()

    # Broadcast the match status data to all connected clients
    socketio.emit('match_status', match_data, room=None)
