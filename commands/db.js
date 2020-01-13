const Discord = require('discord.js');
const config = require("../config.json");
const mysql = require('mysql');

module.exports.run = async (bot, message, args) => {
  //this is where the actual code for the command goes
  await message.delete()

  var con = mysql.createConnection({
    host: "localhost",
    user: config.dbUser,
    password: config.dbPassword,
    database : "iptv"
  });


  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });


}
//name this whatever the command name is.
module.exports.help = {
  name: "db",
  description: "Database"

}
