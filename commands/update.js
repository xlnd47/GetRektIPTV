const Discord = require('discord.js')
const config = require("../config.json")
const request = require('request');
const querystring = require('querystring');
const lodash = require('lodash');

module.exports.run = async (bot, message, args, giveaways) => {
  //this is where the actual code for the command goes
  await message.delete()

  if (!message.member.roles.has(config.devID)){
    return message.reply("Don't try me bru").then(m => m.delete(10000))
    }
    //check voor username ingegeven
    if (args[0] == undefined){
        return message.reply("Geef mij username bru").then(m => m.delete(10000))
    }
    if (args[1] == undefined){
        return message.reply("Geef mij een plan bru").then(m => m.delete(10000))
    }


    var user = args[0]
    var plan = args[1]

    await updateUser(user, plan,message)
}

async function updateUser(user, plan,message){

    var userId = await getUserId(user, plan,message)
}


async function getUserId(user, plan,message){
    var url = 'https://api.bestbuyiptv.store/v1/line/list/'
    var id = 0
    var form = {
        'Line[username]': user
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
            //console.log(data)

            //var picked = lodash.filter(data, x => x.username == usernme);

            var first = lodash.filter(data, x => x.username == user);
            var picked = first[0]
            if (picked == undefined){
                return message.reply("Couldn't find the user..").then(m => m.delete(20000))
            }
            id = picked.id
            await updatenUser(id, plan,message)
        }
    }
    
}

async function updatenUser(id,plan,message){
    var url = 'https://api.bestbuyiptv.store/v1/line/update'
    var package = getPackage(parseInt(plan))
    var form = {
        id: id,
        package: package
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
        method: 'POST',
        body: formData,
        url: url,
        headers: headers
    };

    request(options, callback);    
    async function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = await JSON.parse(body).result
           
            return message.reply(data.username + " updated!").then(m => m.delete(20000))

            console.log(data)
            
        }
    }
}

function getPackage(plan){
    switch (plan) {
        case 0:
            return "NO_CHANGE"
        case 1:
            return "SEVEN_DAYS"
        case 2:
            return "ONE_MONTH"
        case 3:
            return "THREE_MONTHS"
        case 4:
            return "SIX_MONTHS"
        case 5:
            return "TWELVE_MONTHS"
        case 6:
            return "TWENTY_FOUR_MONTHS"
        default:
            return "NO_CHANGE"
    }
}


//name this whatever the command name is.
module.exports.help = {
  name: "update"
}
