var message_container = document.getElementById("messages"); 
var login_button = document.getElementById("send-button-login"); 
const buttons = document.getElementById("send-button-login");
var text_input = document.getElementById("textinput"); 
var send_button = document.getElementById("send-button"); 

var username;

getUsername();
loadMessageCache();


// Request Messages thet are Cached in the Background Script
function loadMessageCache() {
    chrome.runtime.sendMessage({type: "getMessageCache"}, function(response) {
        response.messageCache.forEach(element => {
            addMessage(element);
        });
    });
}


// Get the Username from the Chrome Storage
function getUsername() {
    chrome.storage.local.get(['user'], function(result) {
        console.log(result.user)
        username = result.user;
        showLoginScreen();
    });
}


// If the User already has a Username show the chat Screen else show the Login Screen
function showLoginScreen() {
    console.log(username)
    if(username != undefined) {
        console.log("2")
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
        showLoginScreen();
    });
});


login_button.addEventListener('click', function() {
    console.log('Lets Bread');
    var layers = document.querySelectorAll(".top-layer");
    for (const layer of layers) {
        layer.classList.toggle("active");
    }
});



function addMessage() {
// When the Send Button is Clicked Send Message back to Background Script
send_button.addEventListener('click', function() {
    chrome.runtime.sendMessage({type: "sendMessage", message: {user: username, text: text_input.value}}, function(response) {
        text_input.value = "";
    });
});}


// Listen for incoming Messages
chrome.runtime.onMessage.addListener(function(message, messageSender, sendResponse) {
    if (message.type === "incomingMessage") {
        addMessage(message.message);
    }
});


// Add a Message to the messages div
function addMessage(message) {
    message_container.innerHTML += message.user + ": " + message.text + "<br>"
}