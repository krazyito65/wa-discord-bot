
exports.role = function role(args, user, userID, channelID, bot){

    var serverID = bot.channels[channelID].guild_id; // grab server id
    
    if (!args) {
        bot.sendMessage({
            to: channelID,
            message: "Please select a role:\nDruid\nDeath Knight\nDemon Hunter\nHunter\nMage\nMonk\nPaladin\nPriest\nShaman\nRogue\nWarlock\nWarrior"
        });
        return
    } 

    args = args.trim().split(" ");
    if (args[0] == "remove" && args.length > 1){

        var vRole = validateRole(args[1].toLowerCase()); // check for valid role, return string
        var selectedRole = searchRoles(bot.servers[serverID].roles, vRole);

        console.log("Removing role: " + vRole + " from " + user);
        bot.removeFromRole({"serverID": serverID, "userID": userID, "roleID": selectedRole.id});
        
        bot.sendMessage({
            to: channelID,
            message: "Removing role: "+ vRole + " from " + user
        });

        return
    } 

    var vRole = validateRole(args[0].toLowerCase()); // check for valid role, return string
    if (vRole) {
        var selectedRole = searchRoles(bot.servers[serverID].roles, vRole); // validate role exists on server; return role Object
        if (selectedRole) {
                console.log("Adding role: " + vRole + " to " + user);
                bot.addToRole({"serverID": serverID, "userID": userID, "roleID": selectedRole.id});
                bot.sendMessage({
                    to: channelID,
                    message: "Adding role: "+ vRole + " to " + user
                });
            }
    } else {
        console.log(user + " input invalid role: " + vRole);
        bot.sendMessage({
            to: channelID,
            message: "Invalid role."
        });
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
    var roleList = ["druid", "death knight", "demon hunter", "hunter", "mage", "monk", "paladin", "priest", "shaman", "rogue", "warlock", "warrior"];

    switch(true) {
        case /dk|death/.test(iRole):
            iRole = "death knight";
            break;
        case /dh|demon/.test(iRole):
            iRole = "demon hunter";
            break;
    }

    for (var vRole of roleList) {
        if (vRole == iRole) {
            return toTitleCase(vRole);
        }
    } 
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
