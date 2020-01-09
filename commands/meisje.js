const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
  //this is where the actual code for the command goes
  return message.reply("Hi, Tunahan is een meisje")
}
//name this whatever the command name is.
module.exports.help = {
  name: "meisje",
  description: "Meisje"

}
