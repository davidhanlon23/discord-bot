const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://script:passwordhere@cluster0.x7emi.mongodb.net/jimmy?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
 
const welcomes = ['Welcome to the cool kids club @member! Check out <#854477959389642755> and get some <#865695792894312459>. Glad to have you here!', 'Hey look it’s @member! Welcome to prototype. Please check out <#854477959389642755> and give yourself some <#865695792894312459>. Let’s get this party started! :D']
const serverSchema = new mongoose.Schema({
  id: String,
  welcomeChannel: String,
  autoroles: { type: [ String ], default: [] } 
})
 
const roleSchema = new mongoose.Schema({
  message: String,
  emoji: String,
  role: String
})
 
const serverModel = mongoose.model('server', serverSchema)
const roleModel = mongoose.model('role', roleSchema)
 
client.on('ready', async () => {
    await client.user.setActivity('fuck yeah! business', { type: 'PLAYING' })
    console.log('ready')
})
 
client.on('guildMemberAdd', async member => {
  let server = await serverModel.findOne().where('id', member.guild.id).exec()
  const oldAutoRoles = server.autoroles;
  if(server.autoroles != []) {
    server.autoroles.forEach(autorole => {
      const role = member.guild.roles.cache.get(autorole)
      if(!role) server.autoroles.splice(server.autoroles.indexOf(autorole), 1)
      else member.roles.add(role)
    })
  }
  if(server.autoroles != oldAutoRoles) await server.save()
  if(!server.welcomeChannel) return;
  const welcome = member.guild.channels.cache.get(server.welcomeChannel)
  if(!welcome){
    server.welcomeChannel = null
    await server.save()
    return;
  }
  const message = welcomes[Math.floor(Math.random() * welcomes.length)].replace('@member', `<@${member.user.id}>`)
  welcome.send(message)
  
})
 
client.on("message", async message => {
  if(message.content.startsWith("-reaction")){
    if(message.author.id != '430174837911060490') return message.channel.send('only mutant can run this command!')
    const args = message.content.split(" ");
    if(!args[1]) return message.channel.send("Please include an emoji");
    if(!args[2]) return message.channel.send("There must be an id for the message");
    if(isNaN(args[2])) return message.channel.send("Please include a valid message id");
    if(!args[3]) return message.channel.send("Please include the id of the role ID");
    if(isNaN(args[3])) return message.channel.send("Please include a valid ID for the role that should be given upon reaction.");
    let emoji = ReactionEmojiGrab(args[1]);
    if(!isNaN(emoji)) emoji = client.emojis.cache.get(emoji);
    try{
      const msg = await message.channel.messages.fetch(args[2]);
      await msg.react(emoji);
      const check = await roleModel.findOne({ emoji: emoji.name || emoji.id, message: msg.id }).exec()
      if(check) return message.channel.send('this is already a reaction role!')
      await roleModel({ message: msg.id, emoji: emoji.id || emoji, role: args[3] }).save()
    }catch(e){
      message.channel.send("Error\n" + e);
    }
  }
  if(message.content.startsWith('-setwelcomechannel')) {
    let server = await serverModel.findOne().where('id', message.guild.id).exec()
    if(!server){
      await serverModel({ id: message.guild.id, welcomeChannel: message.channel.id }).save()
    }else{
      server.welcomeChannel = message.channel.id
      server.save()
    }
    message.channel.send('Set this channel to the welcome channel.')
  }
  if(message.content.startsWith('-addautorole')){
    if(message.author.id != '430174837911060490') return message.channel.send('only mutant can run this command!')
    const args = message.content.split(" ");
    if(!args[1]) return message.channel.send('You must include a role id!')
    let server = await serverModel.findOne().where('id', message.guild.id).exec()
    let check = false;
    server.autoroles.forEach(role => {
      if(role == args[1]){
        check = true
        return
      }
    })
    if(check) return message.channel.send('this is already an auto role!')
    server.autoroles.push(args[1])
    await server.save()
    message.channel.send('added to the auto roles!')
  }
})
 
client.on("messageReactionAdd", async (reaction, user) => {
  if(user.bot) return;
  const reactionRole = await roleModel.findOne({ emoji: reaction._emoji.name || reaction._emoji.id, message: reaction.message.id }).exec()
  if(!reactionRole) return;
  try{
    await reaction.message.guild.members.cache.get(user.id).roles.add(reactionRole.role)
  }catch(e){
    console.log(e);
  }
})
 
client.on("messageReactionRemove", async (reaction, user) => {
  if(user.bot) return;
  const reactionRole = await roleModel.findOne({ emoji: reaction._emoji.name || reaction._emoji.id, message: reaction.message.id }).exec()
  if(!reactionRole) return;
  try{
    await reaction.message.guild.members.cache.get(user.id).roles.remove(reactionRole.role)
  }catch(e){
    console.log(e);
  }
})
 
function ReactionEmojiGrab(reactionArg){
  const contents = reactionArg.substring(1, reactionArg.length - 1).split(":");
  if(contents.length > 1){
    return contents[2];
  }else{
    return reactionArg;
  }
}
 
client.login(process.env.token);
