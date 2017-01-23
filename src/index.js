var callBox = document.getElementById('call_box');
callBox.style.display = 'none';
var video_out = document.getElementById("vid-box");
var vid_thumb = document.getElementById("vid-thumb");
var pauseBtn = document.getElementById('pause');
var muteBtn = document.getElementById('mute');
var UUID = Math.random(3).toString(32).substring(2);
document.getElementById('meeting_id').innerHTML = UUID;

var phone = window.phone = PHONE({
  number        : UUID,
  publish_key   : 'pub-c-0d798431-d6a0-467a-abb9-65549fa4eea6',
  subscribe_key : 'sub-c-7421c9e4-de4f-11e6-b2ae-0619f8945a4f',
  ssl: true
});

var ctrl = window.ctrl = CONTROLLER(phone);

phone.unable(function(details){
  console.log("Meeting cannot be started.");
  console.log("Try reloading, or give up.");
  console.log(details);
});

phone.ready(function() {
  vid_thumb.appendChild(phone.video);
});

phone.receive(function(session){
  session.connected(function(session){
    // Append Live Video Feed
    console.log('Call connected');
    video_out.appendChild(session.video);
    document.getElementById('caller_id').innerHTML = session.number;
    callBox.style.display = 'block';
  });
  session.ended(function(session) {
    callBox.style.display = 'none';
    ctrl.getVideoElement(session.number).remove();
    console.log('Call ended');
  });
});

phone.connect(function(){    console.log('network LIVE.') });
phone.disconnect(function(){ console.log('network GONE.') });
phone.reconnect(function(){  console.log('network BACK!') });
phone.debug(function(details) { console.log(details); });

function makeCall(form) {
  phone.dial(form.number.value);
  return false;
}

function end() {
  phone.hangup();
}

function mute() {
  var audio = ctrl.toggleAudio();
  if (!audio) muteBtn.innerHTML = 'Unmute';
  else muteBtn.innerHTML = 'Mute';
}

function pause() {
  var video = ctrl.toggleVideo();
  if (!video) pauseBtn.innerHTML = 'Unpause';
  else pauseBtn.innerHTML = 'Pause';
}

