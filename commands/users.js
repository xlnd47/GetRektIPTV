const Discord = require('discord.js')
const config = require("../config.json")
const request = require('request');
const querystring = require('querystring');
const lodash = require('lodash');
const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: config.dbUser,
    password: config.dbPassword,
    database : "iptv"
  });

module.exports.run = async (bot, message, args) => {
  //this is where the actual code for the command goes
    await message.delete()

    if (!message.member.roles.has(config.devID)){
        return message.reply("Don't try me bru").then(m => m.delete(10000))
    }
    if (args[0] == undefined){
        allesOphalenDb(bot);
    }
    else{
        userOphalen(bot, args[0], message)
    }

    con.end();

}

function userOphalen(bot, usernme, message){

    con.query("SELECT * FROM users WHERE username = '" + usernme +"'", function (err, result, fields) {
        if (err) throw err;
  
        var first = result[0];
            if(first !=[]){
                var url = config.m3uUrl + "username=" + first.username +  "&password="+first.password+"&type=m3u_plus&output=mpegts"
                const exampleEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle('Info for user ' + first.username)
                    .addField('Username', first.username, true)
                    .addField('UserId',first.discordId , true)
                    .addField('Password', first.password, true)
                    .addField('Host', config.hostUrl, true)
                    .addField('m3u URL', url, true )
                    .addField('Expire date',first.expiredAt, true)
                    .setTimestamp()

                bot.channels.get(config.logChannelId).send(exampleEmbed)
                message.reply(exampleEmbed)
            }
      });
      
}



function allesOphalenDb(bot){
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      var fields = new Array();

      result.forEach(x => {
          console.log(x.username);
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
