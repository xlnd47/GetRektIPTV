const Discord = require('discord.js');
const config = require("../config.json")
var con;

module.exports.run = async (bot, message, args, conn) => {
    //this is where the actual code for the command goes

    await message.delete()

    if (!message.member.roles.has(config.devID)){
        return message.reply("Don't try me bru").then(m => m.delete(10000))
    }
    
    con = conn;
    var user = await message.mentions.users.first();
    if (user == undefined){
        return message.reply("Who do I need to add to the username?");
    }

    if (args[1] == undefined){
        return message.reply("Give me a username");
    }

    let sql = `update users set discordId = '${user.id}' where username = '${args[1]}'`;

    con.query(sql, function (err, result) {
        if (err) return message.reply(`Failed to link, check problem. \nerror: ${err} \nresult:${result}`)


        message.reply("Linked");
        bot.channels.get(config.logChannelId).send(`Linked ${args[1]} with discordId ${user.id}`);
    });



}
//name this whatever the command name is.
module.exports.help = {
  name: "link",
  description: "link"

}
