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
    console.log("START==========================================================START")
    console.log("Got a post request. Doing stuff..")
    var git;
    var payload;
    var body = '';
    req.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      git = JSON.parse(body)
      console.log("==========================================================")
      console.log(git)
      console.log("==========================================================")
      if (git.action != "published" && git.action != "edited") {return}
      console.log(git.release.body)
      body = git.release.body;
      if (body.length >= 2000) {
        body = body.slice(0,1900);
        body = body.replace(/\n.*$/, '');
        body += "\n\n - [And more...](" + git.release.html_url + ")";
      }
      username = "Release"
      if (git.repository.name == "WeakAuras2") {username = "WeakAuras"}
      if (git.repository.name == "WeakAuras-Companion") {username = "WeakAuras Companion"}
      payload = {
        "username": username,
        "avatar_url": "https://media.forgecdn.net/avatars/62/782/636142194921799650.png",
        "embeds": [{
          "title": "New Release: " + git.release.tag_name,
          "description": body,
          "url": git.release.html_url,
          "color": 1399932,
          "timestamp": moment().format(),
        }]
      }
      request({
        url: hook,
        method: "POST",
        body: payload,
        json: true
      })
      console.log("payload:")
      console.log(payload);

      response.end("I got your response.");
      console.log("end ========================================================== end")
    }).on('error', (e) => {
      console.log("Error on request: " + e)
    });
  }
  else {
    response.end("Undefined request .");
  }
});

server.listen(8000);
console.log("Server running on port 8000");
