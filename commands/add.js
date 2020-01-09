const Discord = require('discord.js')
const config = require("../config.json")
const request = require('request');
const querystring = require('querystring');

module.exports.run = async (bot, message, args) => {
    //this is where the actual code for the command goes
    await message.delete()
    //geen admin => oprotten bru
    if (!message.member.roles.has(config.devID)){
        return message.reply("Don't try me bru").then(m => m.delete(10000))
    }
    //check voor username ingegeven
    if (args[0] == undefined){
        return message.reply("Geef mij username bru").then(m => m.delete(10000))
    }
    var user = await message.mentions.users.first();
    if (user == undefined){
        makeTrialWithUsername(bot, args[0], message)
    }
    else{
        try {
            var id = await message.mentions.users.first().id
            makeTrial(bot, id, message)
        } catch (error) {
            console.log(error)
            bot.channels.get(config.logChannelId).send(error)
        }
    }
}

function getList(){
    var url = 'https://api.bestbuyiptv.store/v1/bouquet/list/'
    var headers = {'Authorization':'Bearer '+config.apiKey}
    var data = 'name=Brazil'

    var options = {
        method: 'POST',
        body: data,
        url: url,
        headers: headers
    };

    request(options, callback);    
    
    
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(JSON.parse(body))
        }
      }
}
async function makeTrialWithUsername(bot, username, message){
    var url = 'https://api.bestbuyiptv.store/v1/line/create/'

    var form = {
        username: username
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
            var result = await JSON.parse(body).result
            await sendEmbededUsername(bot, result, message);
        } else {
        bot.channels.get(config.logChannelId).send("Fout bij API call...")

        }
      }
}
async function makeTrial(bot, id, message){
    var url = 'https://api.bestbuyiptv.store/v1/line/create/'
    var data = "username=testtest"


    var usrr = bot.fetchUser(id);
    var user = await usrr.then(result => result);
    var u = (user.username+user.discriminator).replace(/ /g,"_")
    var form = {
        username: u
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
            var result = await JSON.parse(body).result
            await sendEmbeded(bot, id, result, message);
        } else {
        bot.channels.get(config.logChannelId).send("Fout bij API call...")

        }
      }
}
async function sendEmbededUsername(bot, result, message){


    //console.log(result)
    var expiredate = toHumanDate(result.expired_at);
    var url = config.m3uUrl + "username=" + result.username +  "&password="+result.password+"&type=m3u_plus&output=mpegts"
    //console.log(expiredate)
     const exampleEmbed = new Discord.RichEmbed()
         .setColor('#0099ff')
         .setTitle('Trial created with username ' + result.username)
         .addField('User with id', "no userId")
         .addField('Username', result.username, true)
         .addField('Password', result.password, true)
         .addField('Host', config.hostUrl, true)
         .addField('m3u URL', url, true )
         .addField('Expire date',expiredate, true)
         .setTimestamp()

      bot.channels.get(config.logChannelId).send(exampleEmbed)
      message.reply(exampleEmbed)
}

async function sendEmbeded(bot, id, result, message){
    var usrr = bot.fetchUser(id);
    var user = await usrr.then(result => result);
    var username = "";

    if (result.username ==''){
        username = "testaccount"
    }


    //console.log(result)
    var expiredate = toHumanDate(result.expired_at);
    var url = config.m3uUrl + "username=" + result.username +  "&password="+result.password+"&type=m3u_plus&output=mpegts"
    //console.log(expiredate)
     const exampleEmbed = new Discord.RichEmbed()
         .setColor('#0099ff')
         .setTitle('Trial created for ' + user.username+"#"+user.discriminator)
         .addField('User with id', user.id)
         .addField('Username', result.username, true)
         .addField('Password', result.password, true)
         .addField('Host', config.hostUrl, true)
         .addField('m3u URL', url, true )
         .addField('Expire date',expiredate, true)
         .setTimestamp()
     const privatedEmbed = new Discord.RichEmbed()
         .setColor('#0099ff')
         .setTitle('Trial account created for you')
         .addField('Username', result.username, true)
         .addField('Password', result.password, true)
         .addField('Host', config.hostUrl, true)
         .addField('m3u URL', url, true )
         .addField('Expire date',expiredate, true)
         .setTimestamp()
    
      bot.channels.get(config.logChannelId).send(exampleEmbed)
      message.reply(exampleEmbed)
      bot.users.get(id).send(privatedEmbed).catch(
          (error) => logError(error, user, bot))
}

function logError(error, user, bot){
    const exampleEmbed = new Discord.RichEmbed()
        .setColor('#ff0000')
        .setTitle('Error for user ' + user.username+"#"+user.discriminator)
        .addField('User with id', user.id)
        .addField('Error', error.message, true)
        .setTimestamp()

    //console.log(error.message)
    bot.channels.get(config.logChannelId).send(exampleEmbed)
}

function toHumanDate(timestamp){
    var theDate = new Date(timestamp * 1000);
    dateString = theDate.toGMTString();
    return dateString
}

//name this whatever the command name is.
module.exports.help = {
  name: "add"
}
