var fs = require('fs');
var http = require('http');
var request = require('request');
var moment = require('moment-timezone');
var hook = fs.readFileSync('hook', "utf8").toString().trim();

const server = http.createServer();

server.on('request', (req, response) => {
  // we should only get POSTS, so ignore everything else.
  response.writeHead(200,{"Content-Type":"application/json"});
  if (req.method == "POST") {
    log("Got a post request. Doing stuff..")
    var git;
    var payload;
    req.on('data', (chunk) => {
      git = JSON.parse(chunk)
      console.log(git.release.body)
      payload = {
        "username": "WeakAuras-Release",
        "avatar_url": "https://media.forgecdn.net/avatars/62/782/636142194921799650.png",
        "embeds": [{
          "title": git.release.tag_name,
          "description": git.release.body,
          "url": git.release.url,
          "color": 1399932,
          "timestamp": moment().format(),
          // "fields": [
          //   {
          //     "name": "Links",
          //     "value": "[Request this webhook](https://goo.gl/forms/S1mkG70XDU543KO23) | [Github](https://github.com/krazyito65/mmo-champion-rss-webhook)"
          //   }
          // ],
          // "footer": {
          //   "text": "This webook is in alpha. Contact Krazyito#1696"
          // },
          // "thumbnail": {
          //   "url": THUMBNAIL_URL//"http://static.mmo-champion.com/images/tranquilizing/logo.png"
          // },
        }]
      }
      request({
        url: hook,
        method: "POST",
        body: payload,
        json: true
      });
    }).on('end', () => {
      response.end("I got your response.");
    });
  }
  else {
    response.end("Undefined request .");
  }
});

server.listen(8000);
console.log("Server running on port 8000");
