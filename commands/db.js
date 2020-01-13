const Discord = require('discord.js');
const config = require("../config.json");
const mysql = require('mysql');

module.exports.run = async (bot, message, args) => {
  //this is where the actual code for the command goes
  await message.delete()

  var con = mysql.createConnection({
    host: "localhost",
    user: config.dbUser,
    password: config.dbPassword
  });



  con.connect(function(err) {
    if (err) throw err;
    message.reply("Connected!").then(m => m.delete(10000))
    con.query(sql, function (err, result) {
      if (err) throw err;
      message.reply("Result: " + result).then(m => m.delete(10000))
    });
  });


}
//name this whatever the command name is.
module.exports.help = {
  name: "db",
  description: "Database"

}
