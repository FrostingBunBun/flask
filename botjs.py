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

startTime = time.time()




print(f"Importing modules...")



import os

import discord
import gspread
from discord.ext import commands
from dotenv import load_dotenv

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



print(f"Importing .env configuration...")

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

print("Initializing Google Authentication...")



print(f"Startup complete!\t[ {(time.time()-startTime):.2f}s ]")

bot = commands.Bot(command_prefix="#", intents=discord.Intents.all())

@bot.event
async def on_ready():
    print("Logged on")
    
    await bot.change_presence(status = discord.Status.online ,activity = discord.Activity(type = discord.ActivityType.listening, name = "bunbun's internal yelling"))





bot.run(TOKEN)