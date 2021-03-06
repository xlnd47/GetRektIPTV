const Discord = require('discord.js')
const config = require("../config.json")
const request = require('request');
const querystring = require('querystring');
const lodash = require('lodash');
var con;
var customerRollId;
var message;

module.exports.run = async (bot, messagee, args, conn) => {
  //this is where the actual code for the command goes
  message = messagee;
  await message.delete()
    con = conn;
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
    var user;
    var plan = args[1]
    user = await message.mentions.users.first();
    if (user != undefined)
        return updateByUserId(user, message, plan);


    user = args[0]
    await updateUser(user, plan,message)

}

function updateByUserId(user, message, plan){
    let sql = `select lineId from users where discordId = "${user.id}"`
    con.query(sql, function(err, result) {
        if (err) console.log(err);
        if (result[0] == undefined)
            return message.reply("didn't find an account linked to this user");

        updatenUser(result[0].lineId, plan, message)


    });


}


async function updateUser(user, plan,message){

    var sql = `select lineId from users where username = "${user}"`;
    con.query(sql, function (err, result) {
        if (err) console.log(err);
        //console.log(result[0].lineId);
        updatenUser(result[0].lineId, plan, message)
    });
    
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


            var sql = `update users set expiredAt = FROM_UNIXTIME(${data.expired_at}) where username = "${data.username}"`;
            con.query(sql, function (err, result) {
              if (err) console.log(err);
              console.log("1 record updated");
            });
            giveCustomerRoll();
            return message.reply(data.username + " updated!").then(m => m.delete(20000))

            
        }
    }
}

function giveCustomerRoll(){

    var sql = `SELECT config.value FROM iptv.config where config.name = 'iptvCustomerRollId'`;
    var role;

    con.query(sql, function (err, result) {
        if (err) console.log(err);
        role = message.guild.roles.get(result[0].value);
    });


    var user  = message.mentions.users.first();
    if (user != undefined){
        let member = message.guild.members.get(user.id);
        member.addRole(role);
        //user.addRole(role).catch(console.error);
    }else {

        //sql zoeken naar discordId 

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
  name: "update",
  description: "Updates username with given plannumber"

}
