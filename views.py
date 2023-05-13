from flask import Blueprint, render_template, jsonify, redirect, url_for
import gspread

views = Blueprint(__name__, "views")

sa_mmr = gspread.service_account("C:/Users/FrostingBunBun/Desktop/else/flask/credentials.json")
sh_mmr = sa_mmr.open("Leaderboards")
wks_mmr = sh_mmr.worksheet("Leaderboards")

test = wks_mmr.get("D4:D")

@views.route("/players")
def get_players():
    print(test)
    return render_template("names.html", list=test)

@views.route("/entry")
def entry():
    return render_template("entry.html")

@views.route("/register")
def register():
    return render_template("register.html")

@views.route("/login")
def login():
    return render_template("login.html")

@views.route("/key")
def key():
    return render_template("key.html")

