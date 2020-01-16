const Discord = require('discord.js')
const config = require("../config.json")
const request = require('request');
const querystring = require('querystring');
const lodash = require('lodash');
const mysql = require('mysql');
var con;

module.exports.run = async (bot, message, args, conn) => {
  //this is where the actual code for the command goes
    await message.delete()
    con = conn;
    if (!message.member.roles.has(config.devID)){
        return message.reply("Don't try me bru").then(m => m.delete(10000))
    }

    var user = await message.mentions.users.first();
    if (user != undefined)
        searchUserById(user, message);


    if (args[0] == undefined){
        allesOphalenDb(bot);
    }
    else{
        userOphalen(bot, args[0], message);
    }


}

function searchUserById(id, message){
    con.quer(`select * from users where discordId = "${user.id}"`, (err, rows) => {
        if(first == undefined)
            return message.reply(`I didn't find an account linked to ${usernme.tag}`);

        sendEmbeded(message, rows[0]);
    });



}
function sendEmbeded(message, user){
    var url = config.m3uUrl + "username=" + user.username +  "&password="+user.password+"&type=m3u_plus&output=mpegts"
    const exampleEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Info for user ' + user.username)
        .addField('Username', user.username, true)
        .addField('UserId',user.discordId , true)
        .addField('Password', user.password, true)
        .addField('Host', config.hostUrl, true)
        .addField('m3u URL', url, true )
        .addField('Expire date',user.expiredAt, true)
        .setTimestamp()

    bot.channels.get(config.logChannelId).send(exampleEmbed)
    message.reply(exampleEmbed)
}



function userOphalen(bot, usernme, message){

    con.query("SELECT * FROM users WHERE username = '" + usernme +"'", function (err, result, fields) {
        if (err) console.log(err);
  
        var first = result[0];
        //console.log(first);
        if(first == undefined)
            return message.reply(`I didn't find ${usernme}`);

        sendEmbeded(message, first);
      });
      
}



function allesOphalenDb(bot){
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) console.log(err);
      var fields = new Array();

      result.forEach(x => {
          fields.push(
            {
                name: x.username,
                value: x.expiredAt
            }
            )
      });

      bot.channels.get(config.logChannelId).send({embed: {
        color: 3447003,
        title: fields.length + " users",
        fields: fields,
        timestamp: new Date()
        }});
    });
}

//name this whatever the command name is.
module.exports.help = {
  name: "users",
  description: "Gives all users with a plan, with ?users username   gives info about that user."

}
