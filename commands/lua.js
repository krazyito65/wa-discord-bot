var request = require('request');
var botFuncs = require('../bot.js');

module.exports = function (args, user, userID, channelID, bot){
    if (args !== undefined && args.length > 0) {
        var lua = args.replace(/^(\n)?`+(LUA|lua)\s+|^(\n)?`+|(\n)?`+$/g, "")
        request.post("https://codewarcraft.com/runlua", {form: {lua:lua}}, function(error, response, body) {
            if (!error && response.statusCode==200) {
                var data = JSON.parse(body)
                if (data.error) {
                    bot.sendMessage({
                        to: channelID,
                        message: "*Error*: "+data.error
                    })
                }
                else if (data.output) {
                    bot.sendMessage({
                        to: channelID,
                        message: "*Lua Output*: ```\n"+data.output.replace("`","\`")+"\n```"
                    })
                    botFuncs.log(data.output)
                }
            }
        })
    }
}
