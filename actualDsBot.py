
import discord
from discord.ext import commands
import os
from dotenv import load_dotenv

print(f"Importing .env configuration...")
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

print(f"Startup complete!")
intents = discord.Intents.default()
intents.members = True
bot = commands.Bot(command_prefix="#", intents=intents)
guild_id = 991300258082590820
guild = bot.get_guild(guild_id)
intents.message_content = True


@bot.event
async def on_ready():
    print("Logged on")
    channel_vc_text = bot.get_channel(1123815180443340800)

    # Get the list of user objects
    users = bot.users


    await bot.change_presence(status=discord.Status.online, activity=discord.Activity(type=discord.ActivityType.listening, name="bunbun's internal yelling"))

bot.run(TOKEN)