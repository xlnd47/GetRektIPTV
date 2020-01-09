const Discord = require('discord.js')
const config = require("../config.json")
const request = require('request');
const querystring = require('querystring');
const lodash = require('lodash');




module.exports.run = async (bot, message, args) => {
  //this is where the actual code for the command goes
    await message.delete()

    if (!message.member.roles.has(config.devID)){
        return message.reply("Don't try me bru").then(m => m.delete(10000))
    }


    if (args[0] == undefined){
        allesOphalen(bot);
    }
    else{
        console.log("zoeken op username: " + args[0])
        userOphalen(bot, args[0], message)


    }


  
}

async function userOphalen(bot, usernme, message){

    var url = 'https://api.bestbuyiptv.store/v1/line/list/'
    var form = {
        'Line[username]': usernme
    }

    var formData = querystring.stringify(form);
    var contentLength = formData.length;
    var headers = 
    {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': contentLength,
        'Authorization':'Bearer '+ config.apiKey
    }

    var options = {
        method: 'GET',
        body: formData,
        url: url,
        headers: headers
    };


    request(options, callback);    
    async function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = await JSON.parse(body).result.data
            console.log(data)

            //var picked = lodash.filter(data, x => x.username == usernme);

            var first = lodash.filter(data, x => x.username == usernme);
            var picked = first[0]
            console.log(picked)
            if(picked !=[]){
                var url = config.m3uUrl + "username=" + picked.username +  "&password="+picked.password+"&type=m3u_plus&output=mpegts"
                var expiredate = toHumanDate(picked.expired_at);

                const exampleEmbed = new Discord.RichEmbed()
                    .setColor('#0099ff')
                    .setTitle('Info for user ' + picked.username)
                    .addField('Username', picked.username, true)
                    .addField('Password', picked.password, true)
                    .addField('Host', config.hostUrl, true)
                    .addField('m3u URL', url, true )
                    .addField('Expire date',expiredate, true)
                    .setTimestamp()

                bot.channels.get(config.logChannelId).send(exampleEmbed)
                message.reply(exampleEmbed)



            }
            

            //console.log(data)
            
        } else {
        bot.channels.get(config.logChannelId).send("Fout bij API call...")

        } 
    }


    
}


function toHumanDate(timestamp){
    var theDate = new Date(timestamp * 1000);
    dateString = theDate.toGMTString();
    return dateString
}



async function allesOphalen(bot){
    var url = 'https://api.bestbuyiptv.store/v1/line/list/'
    var headers = 
    {
        'Authorization':'Bearer '+ config.apiKey
    }

    var options = {
        method: 'GET',
        url: url,
        headers: headers
    };

    request(options, callback);    
    async function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = await JSON.parse(body).result
            //console.log(result)
            var data = await result.data
                
            var fields = new Array();


            console.log(data.length)
            for (var i = 0; i < data.length; i++){
                fields.push(
                    // {
                    //     name: "ID",
                    //     value: data[i].id
                    // },
                    {
                        name: data[i].username,
                        value: data[i].status + " " + toHumanDate(data[i].expired_at)
                    }
                    )
            }                
            //console.log(fields)


            bot.channels.get(config.logChannelId).send({embed: {
                color: 3447003,
                title: data.length + " users",
                fields: fields,
                timestamp: new Date()
              }
            })


        } else {
        bot.channels.get(config.logChannelId).send("Fout bij API call...")

        }
      }

}

function toHumanDate(timestamp){
    var theDate = new Date(timestamp * 1000);
    dateString = theDate.toGMTString();
    return dateString
}

//name this whatever the command name is.
module.exports.help = {
  name: "users"
}
