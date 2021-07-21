const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const mongoose = require('mongoose');
require('dotenv').config();

// mongoose.connect('mongodb+srv://script:passwordhere@cluster0.x7emi.mongodb.net/jimmy?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
// client.on("ready", () => {
//   console.log(`Logged in as ${client.user.tag}!`)
// })

client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})

client.login(process.env.TOKEN);