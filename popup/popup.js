var message_container = document.getElementById("messages"); 
var login_button = document.getElementById("send-button-login"); 
const buttons = document.getElementById("send-button-login");

var username;

showLoginScreen();
loadMessageCache();

function loadMessageCache() {
    chrome.runtime.sendMessage({type: "getMessageCache"}, function(response) {
        response.messageCache.forEach(element => {
            message_container.innerHTML += element.user + ": " + element.text + "<br>"
        });
    });
}

function hasUsername() {
    chrome.storage.local.get(['user'], function(result) {
        console.log(result.user)

        /*if(result.user != undefined) {
            username = result.user;
            return true;
        }

        return false;*/
    });
}

function showLoginScreen() {
    console.log(hasUsername());
    if(hasUsername()) {
        document.getElementById("login").style.display = "none";
        document.getElementById("chat").style.display = "inline";
    }
}

login_button.addEventListener('click', function() {
    var new_username = document.getElementById("textinput-login").value;
    chrome.storage.local.set({user: new_username}, function() {
        console.log('Saved Username: ' + new_username);
        username = new_username;
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

}