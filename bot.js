var fs = require('fs');
var Discord = require('discord.io');
var moment = require('moment-timezone');
var data = fs.readFileSync('token', "utf8");
var token =  data.toString().trim();
var JsonDB = require('node-json-db');
var macros = new JsonDB("./data/macros", true, true);
var timer = setTimeout(function() { bot.connect() }, 600*1000);

var log = exports.log = function(msg) {
    console.log("[" +moment().tz("America/Chicago").format('MM/DD/YYYY h:mm:ss a') + "] " + msg);
}

// commands
var commands = {
    help: require('./commands/help.js'),
    role: require('./commands/role.js'),
    lua: require('./commands/lua.js'),
    wago: require('./commands/wago.js'),
    macro: require('./commands/macro.js'),
    ping: require('./commands/ping.js')
}

var bot = new Discord.Client({
    token: token,
    autorun: true,

});
var prefix = '!'

bot.on('ready', function() {
    console.log("===================================================");
    console.log("TIME: " + moment().tz("America/Chicago").format('MMMM Do YYYY, h:mm:ss a'));
    console.log(bot.username + " - (" + bot.id + ")");    
});


// Main message handler-
bot.on('message', function(user, userID, channelID, message, event) {
    clearTimeout(timer);
    timer = setTimeout(function() { 
	bot.connect();
	log("Time'd out.  Reconnecting");
    }, 600*1000);
    if (message[0] !== prefix) {return}
    else if (userID === bot.id) {return}
    var cmd = message.split(" ");
    var args = '';
    var serverID = bot.channels[channelID].guild_id;
    var serverMacros;
    try { serverMacros = macros.getData("/"+serverID)}
    catch(error) { macros.push("/"+serverID, {})}
    finally{serverMacros = macros.getData("/"+serverID)}
    //log(serverMacros)
    for (var i = 1; i < cmd.length; i++) {
        args += cmd[i] + " ";
    }

    cmd = cmd[0].substring(1);
    // log("cmd: " + cmd);ja
    // log("args: " + args);
    if (cmd === "help") {
        log("Sending command: " + cmd)
        commands[cmd](args.trim(), macros, commands, user, userID, channelID, bot, prefix);
    }else if (commands[cmd]) {
       log("Sending command: " + cmd)
        commands[cmd](args.trim(), user, userID, channelID, bot);
    }else if (serverMacros[cmd]){
        log("Sending macro: " + cmd)

        //check macros table
        bot.sendMessage({
            to: channelID,
            message: serverMacros[cmd]
        });
    }
    macros.reload();
});

bot.on("disconnect", function() {
	log("Bot d/c. Do something.");
	bot.connect();
});

exports.sendMsg = function (channelID, msg) {
    bot.sendMessage({
        to: channelID,
        message: msg
    });
}
