const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Bot is online!');
});

// Handle messages
client.on('message', message => {
  // Check if the message starts with a specific prefix
  if (message.content.startsWith('!hello')) {
    // Send a reply
    message.channel.send('Hello, world!');
  }
});

// Log in to the Discord bot using your bot token
const BOT_TOKEN = 'ya29.A0AVA9y1tTxEdyvKPN1jMRniuKEFw8lLeLJYoQsR7AO7vaAMm-cpxLFU5AD1pVI8E3eCt8GnpyAaEnza5KR9Xh9mm9cMQJEIerdIv5p74gV53EDs2NJU-BxPo0CEai-SViufeWIOky89OpHSGoCXltRUPQJVsXaCgYKATASATASFQE65dr86rh-nnKgrpqkw_DsdNDkIQ0163'; // Replace with your bot token
client.login(BOT_TOKEN);
