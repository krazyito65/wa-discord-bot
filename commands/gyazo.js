var JsonDB = require('node-json-db');
var botFuncs = require('../bot.js')
var gyazoDB = new JsonDB("./data/gyazo", true, true);

module.exports = function (args, user, userID, channelID, bot, sentAsCommand=true){
  //sentAsCommand is a variable that is true by default since most functions are called as commands by defualt.
  var serverID = bot.channels[channelID].guild_id; // grab server id

  if (!sentAsCommand) {
    //if its not a command, check the settings if we should send our msg.
    var data = false; // set the defualt of off
    try{data = gyazoDB.getData("/"+serverID)} //try to get current setting for server
    catch(error){gyazoDB.push("/"+serverID, data)} // if it doens't exist then set it to the default of off

    if (data) {
      //if its not a command (normal msg check) do the checks.
      var containsGyazo = /.*(gyazo).*/.test(args.toLowerCase())
      if (containsGyazo) {
          botFuncs.sendMsg(channelID, "Gyazo sucks.  Use Sharex for less intrusive and better image saving/sharing options. <https://getsharex.com/>");
      }
    }
  }
  else {
    // it is being used as a command.
    var isMod = canManageMessages(bot, userID, serverID)
    if (isMod) {
      var args = args.split(" ");
      if (!args[0]) {botFuncs.sendMsg(channelID, "Not a valid option. Please use true or false"); return}
      var option = args[0].toLowerCase()

      var isValidOption = /(true)|(false)/.test(option)
      var newOption = option === 'true' ? true :
                      option === 'false' ? false :
                      option;

      if (newOption === true || newOption === false) {
        botFuncs.sendMsg(channelID, "Changed the gyazo option to: " + newOption);
    		botFuncs.log(user + " gyazo to " + newOption);
        gyazoDB.push("/" + serverID, newOption) // change the option in the DB
        return
      }
      else {
          botFuncs.sendMsg(channelID, "Not a valid option. Please use true or false");
          return
      }

    }
    else {
      botFuncs.sendMsg(channelID, "You do not have permissons to change the option.");
  		botFuncs.log(user + " attempted to change the gyazo settings");
      return
    }
  }
}

//https://github.com/izy521/discord.io/blob/master/docs/permissions.md
function canManageMessages(client, userID, serverID) {
    var server = client.servers[serverID];
    var member = server.members[userID];
    return member.roles.some( roleID => server.roles[roleID].TEXT_MANAGE_MESSAGES );
}
