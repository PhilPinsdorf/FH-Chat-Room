// Dom Elements that need to be manipulated
var message_container = document.getElementById("messages"); 
var login_button = document.getElementById("send-button-login"); 
var text_input = document.getElementById("textinput"); 
var send_button = document.getElementById("send-button"); 

var username;
getUsername();


// Open Port to Backend
const port = chrome.runtime.connect({ name: "popup" });

// Listen for Messages from Backend
port.onMessage.addListener(function(packet) {
    switch (packet.type) {
        // Receive Message Cache from Backend
        case "receiveMessageCache":
            packet.messageCache.forEach(element => {addMessage(element)});
            break;
        
        // Receive Message from Backend
        case "receiveMessage":
            addMessage(packet.message);
            break;
    }
});

// Requesting Mesage Cache
port.postMessage({type: "getMessageCache"});

// When the Send Button is Clicked Send Message back to Background Script
send_button.addEventListener('click', function() {
    port.postMessage({type: "sendMessage", message: {user: username, text: text_input.value}});
    text_input.value = "";
});

// Add a Message to the messages div
function addMessage(message) {
    message_container.innerHTML += message.user + ": " + message.text + "<br>"
}



// Needs to be redone

// Get the Username from the Chrome Storage
function getUsername() {
    chrome.storage.local.get(['user'], function(result) {
        console.log(result.user)
        username = result.user;
        shouldShowLoginScreen();
    });
}


// If the User already has a Username show the chat Screen else show the Login Screen
function shouldShowLoginScreen() {
    console.log(username)
    if(username != undefined) {
        document.getElementById("login").style.display = "none";
        document.getElementById("chat").style.display = "inline";
    }
}


// When the Login Button is Clicked Save the Username and Show the Chat Screen
login_button.addEventListener('click', function() {
    var new_username = document.getElementById("textinput-login").value;
    if (new_username == "") return;

    chrome.storage.local.set({user: new_username}, function() {
        console.log('Saved Username: ' + new_username);
        username = new_username;
        shouldShowLoginScreen();
    });
});





