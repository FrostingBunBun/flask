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



print(f"Importing .env configuration...")

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

print("Initializing Google Authentication...")



print(f"Startup complete!\t[ {(time.time()-startTime):.2f}s ]")
intents = discord.Intents.default()
intents.members = True
bot = discord.Client(intents=intents)

guild_id = 991300258082590820
guild = bot.get_guild(guild_id)

async def get_member_avatars(guild):
    member_avatars = {}
    
    print(f"Number of members in guild: {len(guild.members)}")
    
    for member in guild.members:
        member_id = member.id
        avatar_hash = member.avatar
        avatar_url = f'https://cdn.discordapp.com/avatars/{member_id}/{avatar_hash}.png'
        member_avatars[member_id] = avatar_url
        print("CLICK")
        
    return member_avatars


async def fetch_member_avatars(guild):
    avatars = await get_member_avatars(guild)
    if avatars:
        return avatars
    else:
        return None

async def start_bot():
    intents = discord.Intents.default()
    intents.typing = False
    intents.presences = False

    bot = commands.Bot(command_prefix="#", intents=intents)

    @bot.event
    async def on_ready():
        print("Logged on")
        guild_id = 991300258082590820
        guild = bot.get_guild(guild_id)
        
        if guild:
            member_avatars = await fetch_member_avatars(guild)
            # print("TEST: ", member_avatars)
            if member_avatars:
                for member_id, avatar_url in member_avatars.items():
                    print(f"Member ID: {member_id}, Avatar URL: {avatar_url}")
            else:
                print("Failed to fetch member avatars.")
        else:
            print("Guild not found.")
        
        await bot.change_presence(status=discord.Status.online, activity=discord.Activity(type=discord.ActivityType.listening, name="bunbun's internal yelling"))

    await bot.start(TOKEN)

asyncio.run(start_bot())