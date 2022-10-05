var message_container = document.getElementById("messages"); 

loadMessageCache();

function loadMessageCache() {
    chrome.runtime.sendMessage({type: "getMessageCache"}, function(response) {
        response.messageCache.forEach(element => {
            message_container.innerHTML += element.user + ": " + element.text + "<br>"
        });
    });
}

function addMessage() {

}