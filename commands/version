var request = require('request');
var botFuncs = require('../bot.js');

module.exports = function (args, user, userID, channelID, bot){
  request.get("https://data.wago.io/api/addons", function(error, response, body) {
    if (!error && response.statusCode==200) {
      try {
        var data = JSON.parse(body)
        var versions = {}
        data.forEach(function (addon) {
          if (addon.addon === 'WeakAuras-2') {
            versions[addon.phase] = addon.version
          }
        })
        bot.sendMessage({
          to: channelID,
          message: `Latest WeakAuras versions:\nPrimary Release: **${versions.Release}**\nBeta: ${versions.Beta}\nAlpha: ${versions.Alpha}`
        })
      }
      catch (e) {
        botFuncs.log('version error ' + e.message)
        bot.sendMessage({
          to: channelID,
          message: "*Error*"
        })
      }
    }
    else {
      botFuncs.log('version error ' + e.message)
      bot.sendMessage({
        to: channelID,
        message: "*Error*"
      })
    }
  })
}
