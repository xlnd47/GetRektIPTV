const Discord = require('discord.js')

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
  
  getUserInfo(user)
}


function getUserInfo(user){

//hier uw code tunahan!!


}




//name this whatever the command name is.
module.exports.help = {
  name: "userinfo"
}
