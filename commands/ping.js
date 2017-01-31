var botFuncs = require('../bot.js')


module.exports = function (args, user, userID, channelID, bot){
	botFuncs.sendMsg(channelID, "Pong!  Bot appears to be working.\n\
		\tInvite link: <https://discordapp.com/oauth2/authorize?&client_id="+bot.id+"&scope=bot&permissions=470019135>\n\
		\tGithub: <https://github.com/krazyito65/wa-discord-bot>\n\
		\tTrello (for on-going ideas): <https://trello.com/b/0wdku3Yq>")
}