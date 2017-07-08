var fs = require('fs');
var Discord = require('discord.io');
var moment = require('moment-timezone');
var data = fs.readFileSync('token', "utf8");
var token =  data.toString().trim();
var JsonDB = require('node-json-db');
var macros = new JsonDB("./data/macros", true, true);
var prefixDB = new JsonDB("./data/prefix", true, true);
var timer = setTimeout(function() { bot.connect() }, 600*1000);

// commands
var commands = {
    help: require('./commands/help.js'),
    role: require('./commands/role.js'),
    lua: require('./commands/lua.js'),
    wago: require('./commands/wago.js'),
    macro: require('./commands/macro.js'),
    ping: require('./commands/ping.js'),
    prefix: require('./commands/prefix.js'),
    gyazo: require('./commands/gyazo.js')
}

var bot = new Discord.Client({
    token: token,
    autorun: true,

});
var prefix = '!'

var log = exports.log = function(msg) {
    console.log("[" + moment().tz("America/Chicago").format('MM/DD/YYYY h:mm:ss a') + "] " + msg);
}



bot.on('ready', function() {
    console.log("===================================================");
    console.log("TIME: " + moment().tz("America/Chicago").format('MMMM Do YYYY, h:mm:ss a'));
    console.log(bot.username + " - (" + bot.id + ")");
});


// Main message handler-
bot.on('message', function(user, userID, channelID, message, event) {
    //var msgID = event["d"].id  // id of the msg
    if (channelID in bot.directMessages) {return} // ignore all direct msgs.  (Can point this to a different command file for future use.)
    var serverID = bot.channels[channelID].guild_id;
    clearTimeout(timer);
    timer = setTimeout(function() {
	bot.connect();
	log("Time'd out.  Reconnecting");
    }, 600*1000);

    //prefix settings
    try{prefix = prefixDB.getData("/"+serverID)} //try to get current prefix for server
    catch(error){prefixDB.push("/"+serverID, prefix)} // if it doens't exist then set it to the default at the top of the code.
    if (userID === bot.id) {return} // if the bot itself sent the msg, ignore it.
    else if (message[0] !== prefix) {
      // if the prefix does not match, try a trigger word.
      commands["gyazo"](message.trim(), user, userID, channelID, bot, false)
      return // otherwise, ignore the msg
    }

    //=================================================================================
    var cmd = message.split(" ");
    var args = '';
    var serverMacros;
    try { serverMacros = macros.getData("/"+serverID)}
    catch(error) { macros.push("/"+serverID, {})}
    finally{serverMacros = macros.getData("/"+serverID)}
    //log(serverMacros)
    for (var i = 1; i < cmd.length; i++) {
        args += cmd[i] + " ";
    }

    cmd = cmd[0].substring(1); //lop off the first character (the prefix)
    // log("cmd: " + cmd);
    // log("args: " + args);
    if (cmd === "help") {//help command
        log("Sending command: " + cmd)
        commands[cmd](args.trim(), macros, commands, user, userID, channelID, bot, prefix);
    }else if (commands[cmd]) { //builtin commands
       log("Sending command: " + cmd)
       commands[cmd](args.trim(), user, userID, channelID, bot);
    }else if (serverMacros[cmd]){ //server macros
        log("Sending macro: " + cmd)
        //check macros table
        bot.sendMessage({
            to: channelID,
            message: serverMacros[cmd]
        });
    }
    macros.reload();
    prefixDB.reload();
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
