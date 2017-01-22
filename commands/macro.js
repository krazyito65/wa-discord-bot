var jsonfile = require('jsonfile')
var fs = require('fs')
var file = './commands/macro.json' // this actually looks from the bots root directory...
var macros = require('./macro.json')
var botFuncs = require('../bot.js')


// Possible arguments are:
// 	1) (add or +) and (remove or -)
// 	2) name of the macro
// 	3) everything else is the macro output


module.exports = function (args, user, userID, channelID, bot){
	// var member = bot.getUser({
	// 	userID: userID,
	// });
	// console.log(member);
	var args = args.split(" ");
	var isValidOption = /(add|\+|edit)/.test(args[0])
	var isRemove = /(remove|-)/.test(args[0])

	if (args.length > 1 && isRemove) {
		console.log("Removing command")
		delete macros[args[1]]
		jsonfile.writeFileSync(file, macros)
		botFuncs.sendMsg(channelID, "Removed command: " + args[1])
	} else if (args.length < 3 || ! isValidOption) {
		if (! isValidOption) {
			botFuncs.sendMsg(channelID, args[0] +" is not a valid option. Please use: add | remove | edit | + | -"); 
			return
		}
		botFuncs.sendMsg(channelID, "Not enough arguments.\nUsage: $macro (add/remove/edit) name output")
	} else {
		var isAdd = /(add|\+)/.test(args[0])
		var isEdit = /(edit)/.test(args[0])
		


		var output = '';
		//combine everything from the output field together to send as one string.
		for (var i = 2; i < args.length; i++) {
	        output += args[i] + " ";
	    }

		if(isEdit){
			if(macros[args[1]]) {
				console.log("Editing command " + args[1])
				macros[args[1]] = output.trim()
				jsonfile.writeFileSync(file, macros)
				botFuncs.sendMsg(channelID, "Edited command: " + args[1])
			}else {
				botFuncs.sendMsg(channelID, "Command does not exist. Use the add option to add a command.")
			}


		}
		else if (isAdd) {
			// check if the command exists.  If yes, edit the command.
			if(!macros[args[1]]) {

				console.log("Adding command " + args[1])
				macros[args[1]] = output.trim()
				jsonfile.writeFileSync(file, macros)
				botFuncs.sendMsg(channelID, "Adding command: " + args[1])
			}
			else {
				console.log("Command already exists, if you are sure you want to overwrite use the edit command.")
				botFuncs.sendMsg(channelID, "Command already exists, if you are sure you want to overwrite use the edit command.")
			}

			
		}
		else {
			botFuncs.sendMsg(channelID, "Tell my programmer he sucks at coding the macro command.")
			console.log("Tell my programmer he sucks at coding the macro command. This should never happen")
		}
	}
}