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

    # Get the list of user objects
    users = bot.users
    # Extract the IDs of each user
    user_ids = [user.id for user in users]
    user_names = [user.name for user in users]
    await bot.change_presence(status=discord.Status.online, activity=discord.Activity(type=discord.ActivityType.listening, name="bunbun's internal yelling"))

    channel = bot.get_channel(1079942014503755896)


@bot.command()
async def process_channel(ctx, channel_id):
    channel = bot.get_channel(int(channel_id))
    await process_messages(channel)
    await ctx.send("Message processing completed.")




async def process_messages(channel):
    print("TEST1")
    # Connect to the database (create it if it doesn't exist)
    conn = sqlite3.connect('./db/matches_data.db')

    # Create a cursor object to execute SQL queries
    cursor = conn.cursor()








    print("TEST2")
    # Commit the changes to the database schema
    conn.commit()

    async for message in channel.history(limit=None, oldest_first=True):

        for embed in message.embeds:
            print("==================================")
            score_string = embed.description
            

            # Splitting the string into two parts using newline as the separator
            parts = score_string.split("\n")
            if not "VS" in parts:
                print(score_string)
                print("Parts:", parts)
                print("++++++++++++++++++++++++++++++++++")
                timestamp = message.created_at
                formatted_time = timestamp.strftime("%Y-%m-%dT%H:%M:%S.%fZ").rstrip('0')
                
                print("finalTIME: ", formatted_time)

                input_datetime = datetime.strptime(formatted_time, "%Y-%m-%dT%H:%M:%S.%fZ")
                output_str = input_datetime.strftime("%Y-%m-%dT%H:%M:%S.%fZ")[:-4] + "Z"
            




                # GET LEFT PLAYER=================================
                leftString = parts[2]
                leftPlayer = leftString.strip("'").split("(")[0]
                print("leftPlayer: ", leftPlayer)
                # GET LEFT PLAYER=================================

                # GET RIGHT PLAYER=================================
                rightString = parts[3]
                rightPlayer = rightString.strip("'").split("(")[0]
                print("rightPlayer: ", rightPlayer)
                # GET RIGHT PLAYER=================================

                # GET SHIFT===========(based one left player)=======
                shiftString = parts[2]
                shiftStart = shiftString.find("+") + 1  # Find the index of the plus sign and move one position ahead
                shiftEnd = shiftString.find("**", shiftStart)  # Find the index of the next double asterisk after the plus sign
                shift = shiftString[shiftStart:shiftEnd]
                print(shift)
                # GET SHIFT=========================================

                winner = leftPlayer
                loser = rightPlayer
            
                # Store the extracted information in your database
                duration = random.randint(40, 90)

                f14 = "F-14"
                mig29 = "Mig-29"
                f18 = "F-18"

                plane = random.choices([f14, mig29, f18], weights=[0.8, 0.1, 0.1], k=1)
                result = ''.join(plane)
                print("PLANE: ", result)
                print("PLANE TYPE: ", type(result))

    
            #     cursor.execute("INSERT INTO Matches (playerLeft, playerRight, winner, loser, timestamp, duration, shift, plane) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            #    (leftPlayer, rightPlayer, winner, loser, output_str, duration, shift, result))
                



    # Commit the changes and close the connection
    conn.commit()
    conn.close()

    
bot.run(TOKEN)