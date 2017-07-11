var botFuncs = require('../bot.js')
var JsonDB = require('node-json-db');
var pad = require('pad');
var lunchDB = new JsonDB("./data/lunch", true, true);

module.exports = function (args, user, userID, channelID, bot){
  var serverID = bot.channels[channelID].guild_id; // grab server id
  try {lunchDB.getData("/" + serverID)} // check if the location exists
  catch(error){lunchDB.push("/" + serverID, {}) }// add a location to the DB.


  var args = args.toLowerCase();
  args = args.split(" ");

  if (args[0].toLowerCase() == 'help') { // help list
    botFuncs.sendMsg(channelID, showHelp());
  }
  else if (args[0] == 'add' && args[1] == 'location'){ // if we want to add a location
    args.splice(0,2) // remove the command and location.
    botFuncs.sendMsg(channelID, addLocation(args.join().replace(new RegExp(",", "g"), " "), serverID));
  }
  else if (args[0].toLowerCase() == 'add') {
    var location = args[1]
    args.splice(0,2) // remove the command and location.
    botFuncs.sendMsg(channelID, addRestaurant(location, args.join().replace(new RegExp(",", "g"), " "), serverID)); // pass in all the food locations listed
  }
  else if (args[0] == 'list') {
    var list = lunchDB.getData("/" + serverID); // get the list of locations
    for (var location in list) {
      if (args[1] == location) {
        botFuncs.sendMsg(channelID, listRestaurant(location, serverID))
        return
      }
    }
    botFuncs.sendMsg(channelID, listLocations(serverID)); //return the list of locations
  }
  else if (args[0] == 'remove' && args[1] == 'location') {
    args.splice(0,2) // remove the command and location.
    botFuncs.sendMsg(channelID, removeLocation(args.join().replace(new RegExp(",", "g"), " "), serverID));
  }
  else if (args[0] == 'remove') {
    var list = lunchDB.getData("/" + serverID); // get the list of locations
    for (var location in list) {
      if (args[1] == location) {
        args.splice(0,2) // remove the command and location.
        botFuncs.sendMsg(channelID, removeRestaurant(location, args.join().replace(new RegExp(",", "g"), " "), serverID))
        return
      }
    }
  }
  else {
    var list = lunchDB.getData("/" + serverID); // get the list of locations
    for (var location in list) {
      if (args[0] == location) {
        botFuncs.sendMsg(channelID, pickRandom(location, serverID))
        return
      }
    }
  }
}

function pickRandom(location, serverID) {
  //pick a random item from the list
  var list = lunchDB.getData("/" + serverID + "/" + location)
  var randomNumber = Math.floor(Math.random() * (list.length - 0)) + 0; //The maximum is exclusive and the minimum is inclusive
  return "You got: **" + toTitleCase(list[randomNumber]) + "**!";
}

function removeLocation(location, serverID) {
  lunchDB.delete("/" + serverID + "/" + location) // delete a location from the DB.
  return toTitleCase(location) + " was removed from the list, or it wasn't there to begin with."
}

function addLocation(location, serverID) {
  lunchDB.push("/" + serverID + "/" + location, [], false) // add a location to the DB.
  return toTitleCase(location) + " was added to the list, or it already existed."
}

function removeRestaurant(location, restaurant, serverID) {
  var list;
  try {list = lunchDB.getData("/" + serverID + "/" + location)} // check if the location exists
  catch(error){return toTitleCase(location) + " is not in the list."}

  for (var i = 0; i < list.length; i++) {
    if (list[i] == restaurant) {
      lunchDB.delete("/" + serverID + "/" + location+"["+i+"]" ) // delete a restaurant from the DB.
      return toTitleCase(restaurant) + " was deleted from " + toTitleCase(location)
    }
  }
  return toTitleCase(restaurant) + " was not part of " + toTitleCase(location)
}

function addRestaurant(location, restaurant, serverID) {
  var list;
  try {list = lunchDB.getData("/" + serverID + "/" + location)} // check if the location exists
  catch(error){return toTitleCase(location) + " is not in the list.  Please add it first with **!lunch add location LOCATION**"}

  for (var i = 0; i < list.length; i++) {
    if (list[i] == restaurant) {
      return toTitleCase(restaurant) + " is already part of " + toTitleCase(location)
    }
  }
  lunchDB.push("/" + serverID + "/" + location, [restaurant], false) // add a restaurant to the DB.
  return toTitleCase(restaurant) + " added to " + toTitleCase(location)
}


function listLocations(serverID) {
  var list = lunchDB.getData("/" + serverID);
  var msg = "";
  for (var location in list) {
    msg += location + "\n";
  }
  return toTitleCase(msg)
}

function listRestaurant(location, serverID) {
  var list;

  try {list = lunchDB.getData("/" + serverID + "/" + location)} // check if the location exists
  catch(error){return toTitleCase(location) + " is not in the list.  Please add it first with **!lunch add location LOCATION**"}

  var msg = "";
  for (var i = 0; i < list.length; i++) {
    msg += list[i] + "\n";
  }
  return toTitleCase(msg)
}

function showHelp() {
  var msg = 'usage: **!lunch [help] [list] [LOCATION] [add LOCATION RESTAURANT] [add location LOCATION] [list location]**\n[remove] is also a valid option.';
  msg += pad('\n\n\tlist', 63);
  msg += 'Lists all locations';

  msg += pad('\n\thelp', 60);
  msg += 'Shows this help';

  msg += pad('\n\t**LOCATION**', 54);
  msg += 'Picks a random restaurant from the list of the location';

  msg += pad('\n\tadd **LOCATION** **RESTAURANT**', 36);
  msg += 'Adds a restaurant to the location list.';

  msg += pad('\n\tadd location **LOCATION**', 43);
  msg += 'Adds a location';

  msg += pad('\n\tlist location', 55);
  msg += 'Lists all restaurants at a location';

  return msg
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
