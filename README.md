# wa-discord-bot
Initial set up of basic discord bot using Node.js for use in the Weak Auras discord.  
This is a very work in progress bot that will allow for git pull requests from the community to add functionality.

First thing you should do is generate a token file to put in the root folder of your bot. It should simply be called `token` and it contains the token from the application you create here: https://discordapp.com/developers/applications/me

Then use: `npm install` to install the dependencies for this bot, then run using `node bot.js`
`release_hook.js` is a seperate file to run with node (use forever to run 2 items easiy)

The commands folder contains all the available commands.

# DEPREACTAION NOTE
discord.io is depreacted.  I have re-written this bot in ruby: https://github.com/krazyito65/ruby-wa-discord-bot
