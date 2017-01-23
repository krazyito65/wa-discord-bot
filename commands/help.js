var macros = require('./macro.json')
var botFuncs = require('../bot.js')


module.exports = function (args, macros, commands, user, userID, channelID, bot, prefix){
	var serverID = bot.channels[channelID].guild_id; // grab server id
	macros = macros[serverID]

	var args = args.split(" ");
	if (/macros?/.test(args[0])){
		var returnString = 'List of current macros:\n'
		console.log("Listing macros")
		for (var macro in macros){
			returnString += "\t" + prefix + macro +"\n"
		}
		botFuncs.sendMsg(channelID, "Check your DM, <@" + userID + ">")
		botFuncs.sendMsg(userID, returnString)
	}else {
		var returnString = 'List of current commands:\n'
		console.log("Listing commands")
		for (var cmd in commands){
			if (cmd === "help") {cmd = "help [macros]"}
			returnString += "\t" + prefix + cmd +"\n"
		}
		botFuncs.sendMsg(channelID, returnString)
	}
}
