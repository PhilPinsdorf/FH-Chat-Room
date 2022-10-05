var message_container = document.getElementById("messages"); 
var login_button = document.getElementById("send-button-login"); 

hasUsername();
loadMessageCache();

function loadMessageCache() {
    chrome.runtime.sendMessage({type: "getMessageCache"}, function(response) {
        response.messageCache.forEach(element => {
            message_container.innerHTML += element.user + ": " + element.text + "<br>"
        });
    });
}

function hasUsername() {
    chrome.storage.sync.get(['user'], function(result) {
        console.log(result);
    });
}

login_button.addEventListener('click', function() {
    var username = document.getElementById("textinput-login").value;
    chrome.storage.local.set({user: username}, function() {
        console.log('Saved Username: ' + username);
    });
});


function addMessage() {

}