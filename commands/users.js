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


  
}

async function userOphalen(bot, usernme, message){

    con.query("SELECT * FROM users WHERE username = '" + usernme +"'", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
  
        // var first = lodash.filter(result, x => x.username == usernme);
        //     var picked = first[0]
        //     if(picked !=[]){
        //         var url = config.m3uUrl + "username=" + picked.username +  "&password="+picked.password+"&type=m3u_plus&output=mpegts"

        //         const exampleEmbed = new Discord.RichEmbed()
        //             .setColor('#0099ff')
        //             .setTitle('Info for user ' + picked.username)
        //             .addField('Username', picked.username, true)
        //             .addField('Password', picked.password, true)
        //             .addField('Host', config.hostUrl, true)
        //             .addField('m3u URL', url, true )
        //             .addField('Expire date',picked.expiredAt, true)
        //             .setTimestamp()

        //         bot.channels.get(config.logChannelId).send(exampleEmbed)
        //         message.reply(exampleEmbed)
        //     }
      });    
}
async function allesOphalenDb(bot){
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



function toHumanDate(timestamp){
    var theDate = new Date(timestamp * 1000);
    dateString = theDate.toGMTString();
    return dateString
}

//name this whatever the command name is.
module.exports.help = {
  name: "users",
  description: "Gives all users with a plan, with ?users username   gives info about that user."

}
