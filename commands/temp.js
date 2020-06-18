var JsonDB = require('node-json-db');
var botFuncs = require('../bot.js')
var tempDB = new JsonDB("./data/temp", true, true);

module.exports = function (args, user, userID, channelID, bot, sentAsCommand = true) {
    //sentAsCommand is a variable that is true by default since most functions are called as commands by defualt.
    var serverID = bot.channels[channelID].guild_id; // grab server id

    if (!sentAsCommand) {
        //if its not a command, check the settings if we should send our msg.
        var data = false; // set the defualt of off
        try { data = tempDB.getData("/" + serverID) } //try to get current setting for server
        catch (error) { tempDB.push("/" + serverID, data) } // if it doens't exist then set it to the default of off

        if (data) {
            //if its not a command (normal msg check) do the checks.
            args = args.toLowerCase()
           // var tempRegex = /(?:^|\s)(-?\d+\.?\d*)\s*°?\s*[^\n\r]([cf])\b/
		   var tempRegex = /(?:^|\s)(-?\d+\.?\d*) ?°? ?([cf])\b/
            var containsTemp = tempRegex.test(args)

            if (containsTemp) {
				var temp = tempRegex.exec(args)
				temp[0] = temp[0].replace(/\s+/g, '')
                botFuncs.log("converting temp: " + temp[0]);

                // temp[0] = original capture
                // temp[1] = number
                // temp[2] = unit
				var unit = temp[2] // == "°" ? temp[3] : temp[2] //isMember ? '$2.00' : '$10.00'
                if (unit == 'f') {
                    botFuncs.sendMsg(channelID, "Temperature Conversion: " + temp[0].toUpperCase() + " is equal to " + fToC(temp[1]) + "C");
                } else if (unit == 'c') {
                    botFuncs.sendMsg(channelID, "Temperature Conversion: " + temp[0].toUpperCase() + " is equal to " + cToF(temp[1]) + "F");
                } else {
                    botFuncs.log("unknown units... " + unit);
                }
            }
        }
    }
    else {
        // it is being used as a command.
        var isMod = canManageMessages(bot, userID, serverID)
        if (isMod) {
            var args = args.split(" ");
            if (!args[0]) { botFuncs.sendMsg(channelID, "Not a valid option. Please use true or false to change the automatic temperature conversion"); return }
            var option = args[0].toLowerCase()

            var isValidOption = /(true)|(false)/.test(option)
            var newOption = option === 'true' ? true :
                option === 'false' ? false :
                    option;

            if (newOption === true || newOption === false) {
                botFuncs.sendMsg(channelID, "Changed the temp option to: " + newOption);
                botFuncs.log(user + " temp to " + newOption);
                tempDB.push("/" + serverID, newOption) // change the option in the DB
                return
            }
            else {
                botFuncs.sendMsg(channelID, "Not a valid option. Please use true or false to change the automatic temperature conversion");
                return
            }

        }
        else {
            botFuncs.sendMsg(channelID, "You do not have permissons to change the option.");
            botFuncs.log(user + " attempted to change the temp settings");
            return
        }
    }
}

//https://github.com/izy521/discord.io/blob/master/docs/permissions.md
function canManageMessages(client, userID, serverID) {
    var server = client.servers[serverID];
    var member = server.members[userID];
    return member.roles.some(roleID => server.roles[roleID].TEXT_MANAGE_MESSAGES);
}

function fToC(temp) {
    return ((temp - 32) / 1.8).toFixed(2)
}

function cToF(temp) {
    return ((temp * 1.8) + 32).toFixed(2);
}
