# @bot.event
# async def on_ready():
#     print("Logged on")

#     # Get the list of user objects
#     users = bot.users
#     # users = []
#     # # print(users)
#     # for x in users_old[:5]:
#     #     users.append(x)

    
#     # Extract the IDs of each user
#     user_ids = [user.id for user in users]
#     # print(user_ids)

#     # Establish a connection to the database
#     conn = sqlite3.connect('user_dsAvis.db')
#     cursor = conn.cursor()

#     # Create a table if it doesn't exist
#     cursor.execute('''CREATE TABLE IF NOT EXISTS dsLinks
#                     (id INTEGER PRIMARY KEY, avatar_url TEXT)''')

#     try:
#         for index, id in enumerate(user_ids):
#             user = await bot.fetch_user(id)
#             avatar_url = user.avatar
#             print("=============================s")
#             print("index: ", index)
#             print(id)
#             print(avatar_url)
#             cursor.execute("INSERT INTO dsLinks (id, avatar_url) VALUES (?, ?)", (str(id), str(avatar_url)))
#             print("=============================s")
#     except Exception as e:
#         print("An error occurred:", e)

#     # Commit the changes and close the connection
#     conn.commit()
#     conn.close()

#     # Print the number of rows inserted
#     print("Total rows inserted:", cursor.rowcount)

#     await bot.change_presence(status=discord.Status.online, activity=discord.Activity(type=discord.ActivityType.listening, name="bunbun's internal yelling"))

# bot.run(TOKEN)