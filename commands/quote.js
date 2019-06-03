var fs = require('fs')
var botFuncs = require('../bot.js')
var JsonDB = require('node-json-db');
var quotes = new JsonDB("./data/quotes", true, true);

module.exports = function (args, user, userID, channelID, bot){
    var serverID = bot.channels[channelID].guild_id
    var isMod = canManageMessages(bot, userID, serverID)

    try { quotes.getData("/"+serverID) }
    catch(error) { quotes.push("/"+serverID, []) }

    var serverQuotes = quotes.getData("/"+serverID)

    if (!args){
        var item = serverQuotes[Math.floor(Math.random()*serverQuotes.length)];
        botFuncs.sendMsg(channelID, item)
        return
    }

    args = args.split(" ")
    var option = args[0]
    args.shift();
    args = args.join(" ");

    var isValidOption = /(add|\+)/.test(option)
    var isRemove = /(remove|-)/.test(option)

    if  (!isValidOption && !isRemove) {
        botFuncs.sendMsg(channelID, "Not a valid option\nUse !quote [add|+|remove|-] quote")
        return
    }
    if(isValidOption) {
        botFuncs.log("adding quote: " + args)
        serverQuotes.push(args)
        quotes.push("/"+serverID, serverQuotes)
        botFuncs.sendMsg(channelID, "Added quote.")
        return
    }
    if (isRemove) {
        if (!isMod) {
            botFuncs.sendMsg(channelID, "You're not a mod. Denied.")
            return
        }
        serverQuotes = removeFrmArr(serverQuotes, args)
        if (serverQuotes === 0) {
            botFuncs.sendMsg(channelID, "Quote not found.")
        } else {
            quotes.push("/"+serverID, serverQuotes)
            botFuncs.sendMsg(channelID, "Removed quote.")
            botFuncs.log("removing quote: " + args)
        }

    }
}

function removeFrmArr(array, element) {
  if (!array.includes(element)) { return 0 }
  return array.filter(e => e !== element);
}

//https://github.com/izy521/discord.io/blob/master/docs/permissions.md
function canManageMessages(client, userID, serverID) {
    var server = client.servers[serverID];
    var member = server.members[userID];
    return member.roles.some( roleID => server.roles[roleID].TEXT_MANAGE_MESSAGES );
}
