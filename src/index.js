var video_out = document.getElementById("vid-box");
var vid_thumb = document.getElementById("vid-thumb");
var phone;

function login(form) {
  phone = window.phone = PHONE({
      number        : form.username.value || "Anonymous", // listen on username line else Anonymous
      publish_key   : 'pub-c-0d798431-d6a0-467a-abb9-65549fa4eea6',
      subscribe_key : 'sub-c-7421c9e4-de4f-11e6-b2ae-0619f8945a4f',
  }); 

  phone.unable(function(details){
    console.log("Phone is unable to initialize.");
    console.log("Try reloading, or give up.");
  });
  var ctrl = window.ctrl = CONTROLLER(phone);

  ctrl.receive(function(session) {
    session.connected(function(session){ video_out.appendChild(session.video); }); // New Call
    session.ended(function(session) { ctrl.getVideoElement(session.number).remove(); });    // Call Ended
  }); // Called on incoming call/call ended

  ctrl.ready(function() {  // Called when ready to receive call
    form.username.style.background="#55ff5b"; // Turn input green
    form.login_submit.hidden="true";  // Hide login button
    ctrl.addLocalStream(vid_thumb);   // Place local stream in div
  });

  ctrl.videoToggled(function(session, isEnabled) {
    ctrl.getVideoElement(session.number).toggle(isEnabled); // Hide video is stream paused
  });

  ctrl.audioToggled(function(session, isEnabled) {
    ctrl.getVideoElement(session.number).css("opacity",isEnabled ? 1 : 0.75); // 0.75 opacity is audio muted
  });

  return false;   // So the form does not submit.
}

phone.connect(function(){    console.log('network LIVE.') });
phone.disconnect(function(){ console.log('network GONE.') });
phone.reconnect(function(){  console.log('network BACK!') });

function makeCall(form) {
  if (!window.phone) alert("Login First!");
  // console.log('dialling')
  phone.dial(form.number.value);
  return false;
}

function end() {
  ctrl.hangup();
}

function mute() {
  var audio = ctrl.toggleAudio();
  if (!audio) $("#mute").html("Unmute");
  else $("#mute").html("Mute");
}

function pause() {
  var video = ctrl.toggleVideo();
  if (!video) $('#pause').html('Unpause');
  else $('#pause').html('Pause');
}


