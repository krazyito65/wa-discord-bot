var fs = require('fs')
var botFuncs = require('../bot.js')
var JsonDB = require('node-json-db');
var quotes = new JsonDB("./data/quotes", true, true);

module.exports = function (args, user, userID, channelID, bot){
    var serverID = bot.channels[channelID].guild_id
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
        serverQuotes = removeFrmArr(serverQuotes, args)
        if (serverQuotes === 0) {
            botFuncs.sendMsg(channelID, "Quote not found.")
        } else {
            quotes.push("/"+serverID, serverQuotes)
            botFuncs.sendMsg(channelID, "Removed quote.")
        }

    }
}

function removeFrmArr(array, element) {
  if (!array.includes(element)) { return 0 }
  return array.filter(e => e !== element);
};
