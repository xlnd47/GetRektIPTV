const Discord = require('discord.js')
const config = require("../config.json")

module.exports.run = async (bot, message, args) => {
    if (!message.member.roles.has(config.devID)){
        return message.reply("Don't try me bru").then(m => m.delete(10000))
    }

    let evaled;
    try {
      evaled = await eval(args.join(' '));
      message.channel.send(inspect(evaled));
      console.log(inspect(evaled));
    }
    catch (error) {
      console.error(error);
      bot.channels.get(config.logChannelId).send(error)
      message.reply('there was an error during evaluation.');
    }

}
//name this whatever the command name is.
module.exports.help = {
  name: "eval"
}
