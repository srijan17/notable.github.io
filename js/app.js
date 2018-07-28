/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;
var publisher
var session
function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function startPublish(){
  var publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  session.publish(publisher)
}


function stopPublish(){
  session.unpublish(publisher)
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);


  
session.on('signal',(event)=>{
  if(event.data=="publish")
  startPublish()
  else{
    stopPublish()
  }
})

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on("sessionConnected",(event)=>{console.log("connected"); console.dir(event)})

  // session.on('sessionDisconnected', function sessionDisconnected(event) {
  //   console.log('You were disconnected from the session.', event.reason);
  // });

  // initialize the publisher
  
  // Connect to the session
  session.connect(token, function callback(error) {
    if (error) {
      handleError(error);
    } else {
      //personal ID Remove from the list
      console.log(session.connection.connectionId)
      // session.connection.id
      // $("connectionId").text(session.)

      // If the connection is successful, publish the publisher to the session
    }
  });
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;

    initializeSession();
  }).catch(function catchErr(error) {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}

