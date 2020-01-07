const Discord = require('discord.js')
const config = require("../config.json")

module.exports.run = async (bot, message, args) => {
  //this is where the actual code for the command goes
  await message.delete()
  
  if (!message.member.roles.has(config.devID)){
        return message.reply("Don't try me bru").then(m => m.delete(10000))
  }
  //check voor username ingegeven
  if (args[0] == undefined){
      return message.reply("Geef mij username bru").then(m => m.delete(10000))
  }
  var user = await message.mentions.users.first()
  if (user == undefined){
      return message.reply("Dit is geen user, bru").then(m => m.delete(10000))
  }
  
  getUserInfo(user, bot)
}


function getUserInfo(user, bot){

  //hier uw code tunahan!!
  bot.channels.get(config.logChannelId).send("Verander mij naar iets nuttigs")

}




//name this whatever the command name is.
module.exports.help = {
  name: "userinfo"
}
