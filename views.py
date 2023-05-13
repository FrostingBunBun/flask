from flask import Blueprint, render_template, jsonify, redirect, url_for
import gspread

views = Blueprint(__name__, "views")

sa_mmr = gspread.service_account("C:/Users/FrostingBunBun/Desktop/else/flask/credentials.json")
sh_mmr = sa_mmr.open("Leaderboards")
wks_mmr = sh_mmr.worksheet("Leaderboards")

test = wks_mmr.get("D4:D")

@views.route("/home")
def home():
    return render_template("index.html", name="Tim")

@views.route("/players")
def get_players():
    print(test)
    return render_template("names.html", list=test)

