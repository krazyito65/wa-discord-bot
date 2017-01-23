var botFuncs = require('../bot.js')



module.exports = function (args, user, userID, channelID, bot){

    var serverID = bot.channels[channelID].guild_id; // grab server id
    
    if (!args) {

        botFuncs.sendMsg(channelID, "Please select a role:\nDruid\nDeath Knight\nDemon Hunter\nHunter\nMage\nMonk\nPaladin\nPriest\nShaman\nRogue\nWarlock\nWarrior")
        return
    } 

    args = args.split(" ")
    if (args[0] == "remove" && args.length > 1){

        var vRole = validateRole(args[1].toLowerCase()); // check for valid role, return string
        var selectedRole = searchRoles(bot.servers[serverID].roles, vRole);

        console.log("Removing role: " + vRole + " from " + user);
        bot.removeFromRole({"serverID": serverID, "userID": userID, "roleID": selectedRole.id});
        botFuncs.sendMsg(channelID, "Removing role: "+ vRole + " from " + user)
        return
    } 

    var vRole = validateRole(args[0].toLowerCase()); // check for valid role, return string
    if (vRole) {
        var selectedRole = searchRoles(bot.servers[serverID].roles, vRole); // validate role exists on server; return role Object
        if (selectedRole) {
            console.log("Adding role: " + vRole + " to " + user);
            bot.addToRole({"serverID": serverID, "userID": userID, "roleID": selectedRole.id});
            botFuncs.sendMsg(channelID, "Adding role: "+ vRole + " to " + user)
        }
    } else {
        console.log(user + " input invalid role: " + vRole);
        botFuncs.sendMsg(channelID, "Invalid role.")
    }
}


function searchRoles(serverRoles, inputRole) {
    for (var roleID in serverRoles){
        if (serverRoles[roleID].name === inputRole){
            return serverRoles[roleID];
        }
    }
}



function validateRole(iRole) {
    var roleList = ["druid", "death knight", "demon hunter", "hunter", "mage", "monk", "paladin", "priest", "shaman", "rogue", "warlock", "warrior", "WAalpha"];

    switch(true) {
        case /dk|death/.test(iRole):
            iRole = "death knight";
            break;
        case /dh|demon/.test(iRole):
            iRole = "demon hunter";
            break;
        case /alpha/.test(iRole):
            iRole = "WAalpha";
            break;
    }

    for (var vRole of roleList) {
        if (vRole == iRole) {
            if (iRole == "WAalpha") {return "WAalpha";}
            else {return toTitleCase(vRole);}
        }
    } 
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
