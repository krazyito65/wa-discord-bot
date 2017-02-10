var botFuncs = require('../bot.js')

module.exports = function (args, user, userID, channelID, bot){
	if (!args){
		botFuncs.log("Sending wago link");
		bot.sendMessage({
            to: channelID,
            message: "https://wago.io/ - Please check wago before requesting auras"
        })
	} else {
		botFuncs.log("Sending wago search link");
		bot.sendMessage({
            to: channelID,
            message: "<https://wago.io/search?q=" + args.replace(/ /g,"+") + ">"
        })
	}
}



// if (message.cleancontent.indexOf("$")!=0 && (m = /(https?:\/\/pastebin\.com\/[^\s]+)/.exec(message.cleancontent)) !== null) {
//   logMsg(m[1])
//     unirest.post("https://wago.io/api/v1/import")
//       .header("Accept", "application/json")
//       .send({apikey: "57b243ea67dfee6945b55268-4ysWQ4iKZNJgiZQ4sYb"
//              , importString: m[1]
//              , expires: "1 Week"})
//       .end(
//         function(resp) {
//           if (resp.status==200 && !resp.body.error) {
//           ch.sendMessage("<"+m[1]+"> -> https://wago.io/"+resp.body.wago+" Note: this aura will expire in 1 week. Please save if needed.")
//           }
//         }
//         );
//     }



