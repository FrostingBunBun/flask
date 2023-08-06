print(f"Starting bot...")


from asyncio import events
from cgi import print_form
from concurrent.futures import thread
# from curses import BUTTON1_RELEASED
from datetime import datetime
from dis import disco
from email import message
from email.errors import NonPrintableDefect
from enum import EnumMeta
from http import client
from io import BufferedRandom
from multiprocessing.sharedctypes import Value
from operator import index
from pydoc import cli
from re import I, L
# from selectors import EpollSelector
from sqlite3 import Row
# from sys import platlibdir
from tabnanny import check
import telnetlib
from tempfile import tempdir
from threading import local
import time
from traceback import print_tb
from turtle import color, right, title
from unicodedata import name
from unittest import skip
from urllib import request
from xml.etree.ElementTree import tostring
import threading
import sched
import asyncio
import textwrap
import random

startTime = time.time()


import re

print(f"Importing modules...")



import os
import discord.ext
import discord
import gspread
from discord.ext import commands
from dotenv import load_dotenv
import aiohttp

from threading import Timer
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import multiprocessing
import time
import discord.utils
# import httplib2
import sqlite3


print(f"Importing .env configuration...")

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

print("Initializing Google Authentication...")



print(f"Startup complete!\t[ {(time.time()-startTime):.2f}s ]")
intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="#", intents=intents)
guild_id = 991300258082590820
guild = bot.get_guild(guild_id)


intents.message_content = True




@bot.event
async def on_ready():
    print("Logged on")
    channel = bot.get_channel(1123815180443340800)
    await channel.send("nigers")

    # Get the list of user objects
    users = bot.users
    # users = []
    # # print(users)
    # for x in users_old[:5]:
    #     users.append(x)

    
    # Extract the IDs of each user
    user_ids = [user.id for user in users]
    # print(user_ids)

    # Establish a connection to the database
    conn = sqlite3.connect('user_dsAvis.db')
    cursor = conn.cursor()

    # Create a table if it doesn't exist
    cursor.execute('''CREATE TABLE IF NOT EXISTS dsLinks
                    (name TEST, id INTEGER PRIMARY KEY, avatar_url TEXT)''')

    try:
        for index, id in enumerate(user_ids):
            user = await bot.fetch_user(id)
            avatar_url = user.avatar
            print("=============================s")
            print("username: ", str(user.name))
            print("index: ", index)
            print(id)
            print(avatar_url)
            cursor.execute("INSERT INTO dsLinks (name, id, avatar_url) VALUES (?, ?, ?)", (str(user.name), str(id), str(avatar_url)))
            print("=============================s")
    except Exception as e:
        print("An error occurred:", e)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

    # Print the number of rows inserted
    print("Total rows inserted:", cursor.rowcount)

    await bot.change_presence(status=discord.Status.online, activity=discord.Activity(type=discord.ActivityType.listening, name="bunbun's internal yelling"))

bot.run(TOKEN)