# bot_instance.py
import discord
from discord.ext import commands
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="#", intents=intents)
guild_id = 991300258082590820
guild = None  # We'll set this later
intents.message_content = True

@bot.event
async def on_ready():
    global guild
    guild = bot.get_guild(guild_id)
    print(f'Logged in as {bot.user.name}')

    channel = bot.get_channel(1138618835319136336)

    await bot.change_presence(status=discord.Status.online, activity=discord.Activity(type=discord.ActivityType.listening, name="bunbun's internal yelling"))

def run_bot():
    print("Bot starting...")
    # bot.run(TOKEN)

def get_bot_instance():
    return bot

async def send_message(ctx):
    channel = bot.get_channel(1138618835319136336)
