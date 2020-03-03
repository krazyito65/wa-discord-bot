var botFuncs = require('../bot.js')
var fsPath = require('fs-path');

module.exports = function (args, macros, commands, user, userID, channelID, bot, prefix, quotes){
	var serverID = bot.channels[channelID].guild_id; // grab server id
	serverMacros = macros.getData("/"+serverID)
	serverQuotes = quotes.getData("/"+serverID)

	var args = args.split(" ");
	if (/macros?/.test(args[0])){
		var returnString = 'List of current macros:\n'
		botFuncs.log("Listing macros")
		serverMacros = sortObject(serverMacros)
		for (var macro in serverMacros){
			returnString += prefix + macro + ": " + serverMacros[macro] +"\n==================================================\n"
		}

		returnString = returnString.replace(/</g, "&lt;");
		returnString = returnString.replace(/>/g, "&gt;");

		returnString = "<head><meta charset=\"utf-8\"/></head><pre>" + returnString + "</pre>"

		fsPath.writeFile("data/" + serverID, returnString, function(err){
			botFuncs.log("Updated the macros info file for: " + serverID)
		});

		botFuncs.sendMsg(channelID, "You can find the macros here: http://bot.weakauras.wtf/" + serverID)

	} else if (/quotes?/.test(args[0])) {
		var returnString = 'List of current quotes:\n'
		botFuncs.log("Listing quotes")
		serverQuotes = sortObject(serverQuotes)
		for (var quote in serverQuotes){
			returnString += serverQuotes[quote] +"\n==================================================\n"
		}

		returnString = returnString.replace(/</g, "&lt;");
		returnString = returnString.replace(/>/g, "&gt;");

		returnString = "<head><meta charset=\"utf-8\"/></head><pre>" + returnString + "</pre>"

		fsPath.writeFile("data/quotes/" + serverID, returnString, function(err){
			botFuncs.log("Updated the quotes info file for: " + serverID)
		});

		botFuncs.sendMsg(channelID, "You can find the list of quotes here: http://bot.weakauras.wtf/quotes/" + serverID)
	}
	else {
		var returnString = 'List of current commands:\n'
		botFuncs.log("Listing commands")
		commands = sortObject(commands)
		for (var cmd in commands){
			if (cmd === "help") {cmd = "help [macros|quotes]"}
			returnString += "\t" + prefix + cmd +"\n"
		}
		botFuncs.sendMsg(channelID, returnString)
	}
}

function sortObject(o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (key = 0; key < a.length; key++) {
        sorted[a[key]] = o[a[key]];
    }
    return sorted;
}
