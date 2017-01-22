var express = require('express');
var port = process.env.PORT || '5556'
var path = require('path');

var app = express();


app.use(express.static('src'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.post("/subscription", (request, response) => {
  var event = request.body;
  console.info('entering presence webhook for uuid/user: ' + event.uuid);

  pubnub.publish({
    channel: "wh-raw",
    message: event,
    callback: function(result) {
      console.info("published status to wh-raw channel{" + result[2] + "}");
    }
  });

  if ((!event) || (!event.action)) {
    console.info("could not process event: " + JSON.stringify(event));
    response.status(200).end();
    return;
  }
  
  //use a channel with the same name as the uuid to determine
  //if you need to update the status of the profile.
  if (event.channel === event.uuid) {
    console.info("user-status-change-event captured: " + event.channel);
    var profile = profileRepository.find(event.channel);
    if (profile === null) {
      console.log("profile for uuid not found: " + event.uuid);
      response.status(200).end();
      return;
    }

    if (event.action === "join") {
      profile = new repository.Profile(event.uuid);
      console.info("user-status-change-event: changed status for" + profile.userName + " from " + profile.status + "to loggingIn");
      profile.status = "loggingIn";
      profileRepository.put(profile);
    }

    if (event.action === "state-change") {
      //if the user sends lat/latlong
      console.info("status-change with data");
      console.info(event.data);

      if (event.data.status) {
        profile.status = event.data.status;
      }

      profile.firstName = event.data.firstName;
      profile.lastName = event.data.lastName;
      profile.email = event.data.email;
      profile.userName = event.data.userName;

    }

    if ((event.action === "leave") || (event.action === "timeout")) {

      /*SAMPLE...use whereNow to capture a list of offline
          channels to monitor*/
      pubnub.where_now({
        uuid: event.uuid,
        callback: function(results) {
          console.info(results);
          var lp = profileRepository.find(event.uuid);
          if (lp != null) {
            lp.offlineChannels = results.channels;
            //make sure they are on the global channel
            //this is only for DEMO...
            lp.offlineChannels.push("AWG-global");
            profileRepository.put(lp);
          }
        }
      })

      profile.status = "offline";

    }

    profileRepository.put(profile);
    response.status(200).json(profile).end();
    return;
  }
  response.status(200).end();
});


app.listen(port, function() {
  console.log('app running on 5556');
});
