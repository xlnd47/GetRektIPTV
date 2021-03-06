const Discord = require("discord.js")
const config = require("./config.json")
const bot = new Discord.Client();
const fs = require("fs");
const mysql = require('mysql');
const uuid = require('uuid');
var con;
var pool;

bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

jsfile.forEach((f, i) =>{
  let props = require(`./commands/${f}`);
  console.log(`${f} loaded!`);
  bot.commands.set(props.help.name, props);
});

});
try {
  // Connection Setup
  pool = mysql.createPool({
    host: "localhost",
    user: config.dbUser,
    password: config.dbPassword,
    database : "iptv"
  });


  pool.getConnection(function(err, connection) {
    if(err){
      console.log(err);
      callback(true);
      return;
    };
    con = connection;
  });


} catch (e) {
  console.error(e);
}



bot.on("ready", () => {
  console.log(bot.user.username + " is online.")
  bot.user.setPresence({
    game: { 
        name: 'my code',
        type: 'WATCHING'
    },
    status: 'idle'

  }) 
  updateUserList();
  bot.channels.get(config.logChannelId).send("Ik ben opnieuw opgestart!")

});

bot.on("message", async message => {
  //a little bit of data parsing/general checks
  if(message.author.bot) return;


  if(message.content.indexOf(config.prefix) !== 0) return;
  if(message.channel.type === 'dm') return;
  let content = message.content.split(" ");
  let command = content[0];
  let args = content.slice(1);
  let prefix = config.prefix;



  //checks if message contains a command and runs it
  let commandfile = bot.commands.get(command.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args, con);
})

bot.on("guildMemberAdd", (member) => {
  updateUserList();
});

bot.on("guildMemberRemove", (member) => {
  updateUserList();
});

function updateUserList(){
  var users = bot.guilds.get(config.getrektGuild).members.filter(member => !member.user.bot).size;
  bot.guilds.get(config.getrektGuild).channels.get(config.userlistChannel).setName(users + " total users!");
}



bot.login(config.token)
