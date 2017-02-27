var JsonDB = require('node-json-db');
var botFuncs = require('../bot.js')
var prefix = new JsonDB("./data/prefix", true, true);

module.exports = function (args, macros, commands, user, userID, channelID, bot, prefix){
	var serverID = bot.channels[channelID].guild_id; // grab server id

	var args = args.split(" ");
	var newPrefix = args[0];

	bot
}

