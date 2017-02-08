var fs = require('fs')
var JsonDB = require('node-json-db');
var botFuncs = require('../bot.js')
var macros = new JsonDB("./data/macros", true, true);

// Possible arguments are:
// 	1) (add or +) and (remove or -)
// 	2) name of the macro
// 	3) everything else is the macro output


module.exports = function (args, user, userID, channelID, bot){

	// var userRoles = bot.servers[serverID].members[userID].roles
	// var serverRoles = bot.servers[serverID].roles

	var serverID = bot.channels[channelID].guild_id
	var isMod = canManageMessages(bot, userID, serverID)

	if (!isMod) {
		botFuncs.log(user + "denied macro command")
		botFuncs.sendMsg(channelID, "You do not have permisson to use that"); 
		return
	}

	var args = args.split(" ");
	var isValidOption = /(add|\+|edit)/.test(args[0])
	var isRemove = /(remove|-)/.test(args[0])
	var currMacro = "/"+serverID+"/"+args[1]

	if (args.length > 1 && isRemove) {
		botFuncs.log("Removing command")
		//remove data
		macros.delete(currMacro)
		botFuncs.sendMsg(channelID, "Removed command: " + args[1])
	} else if (args.length < 3 || ! isValidOption) {
		if (! isValidOption) {
			botFuncs.sendMsg(channelID, args[0] +" is not a valid option. Please use: add | remove | edit | + | -"); 
			return
		}
		botFuncs.sendMsg(channelID, "Not enough arguments.\nUsage: $macro `(add/remove/edit)` `name` `output`")
	} else {
		var isAdd = /(add|\+)/.test(args[0])
		var isEdit = /(edit)/.test(args[0])
		


		var output = '';
		//combine everything from the output field together to send as one string.
		for (var i = 2; i < args.length; i++) {
	        output += args[i] + " ";
	    }
	    try {var data = macros.getData(currMacro)}
	    catch(error) {var data = false}

		if(isEdit){
			if(data) {
				botFuncs.log("Editing command " + args[1])
				//edit data
				macros.push(currMacro, output)
				botFuncs.sendMsg(channelID, "Edited command: " + args[1])
			}else {
				botFuncs.sendMsg(channelID, "Command does not exist. Use the add option to add a command.")
			}


		}
		else if (isAdd) {
			// check if the command exists.  If yes, edit the command.
			if(!data) {
				botFuncs.log("Adding command " + args[1])
				//add data
				macros.push(currMacro, output)
				botFuncs.sendMsg(channelID, "Adding command: " + args[1])
			}
			else {
				botFuncs.log("Command already exists, if you are sure you want to overwrite use the `edit` command.")
				botFuncs.sendMsg(channelID, "Command already exists, if you are sure you want to overwrite use the edit command.")
			}
		}
	}
}

function canManageMessages(client, userID, serverID) {
    var server = client.servers[serverID];
    var member = server.members[userID];
    return member.roles.some( roleID => server.roles[roleID].TEXT_MANAGE_MESSAGES );
}