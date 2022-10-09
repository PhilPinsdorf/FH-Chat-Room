/*
Ablauf:
 - Bei Start: Lade die letzten 10 Nachichten in ein JSON Objekt, dass dann immer angezeigt wird, wenn das Popup geöffnet wird. DONE
 - Bei Hook: Füge Nachicht in JSON Objekt hinzu und aktualisier Tabelle in Popup 
 - Bei Send: Füge Nachicht in JSON Objekt hinzu, pushe in Database und aktualisier Tabelle in Popup
*/



// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, addDoc, collection, query, onSnapshot, Timestamp, where } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js'

// Vars
const start_timestamp = Timestamp.now();
let message_cache = []
let msgPort;
let canMessage;
let unreadMessages = 0;

//Api Keys
const firebaseConfig = {
    apiKey: "AIzaSyA0RO5Yujusyw8T1ypBapibhs-qftyw_Tg",
    authDomain: "fh-aachen-chat-room.firebaseapp.com",
    projectId: "fh-aachen-chat-room",
    storageBucket: "fh-aachen-chat-room.appspot.com",
    messagingSenderId: "187380571422",
    appId: "1:187380571422:web:bbbda325ff564737ba7d0f",
    measurementId: "G-4Y704HZKYZ"
};

// Set Badge Color
chrome.action.setBadgeBackgroundColor({color: 'red'});

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const c = collection(db, "messages");  
const q = query(c, where("date", ">", start_timestamp));

// Listen for Updates from Database
onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") 
      addMessage(change.doc.data());
  });
});

// Upload Message to Firestore
function uploadMessage(message) {
  addDoc(c, {
    user: message.user,
    message: message.text,
    date: Timestamp.now()
  }).then(res => {
    console.log("Document written with ID: ", res.id);
  });
}



// Connect to Popup once its opened and close connection, when Popup is closed
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    msgPort = port;
    canMessage = true;
    removeUnread();

    // Message Listener
    msgPort.onMessage.addListener(function(packet) {
      switch (packet.type) {
        // Sending Back Message Cache
        case "getMessageCache": 
          msgPort.postMessage({type: "receiveMessageCache", messageCache: message_cache});
          break;

        // Send Message
        case "sendMessage":
          uploadMessage(packet.message);
          break;
      }
    });

    // Disconnect Lstener
    msgPort.onDisconnect.addListener(function() {
      canMessage = false;
    });
  }
});

// Add Message to Cache and send it to Popup
function addMessage(data){
  const message = {
    user: data.user,
    text: data.message,
    date: data.date
  };
  
  message_cache.push(message);

  if (canMessage) {
    msgPort.postMessage({type: "receiveMessage", message: message});
  } else {
    increaseUnread();
  }
}

function increaseUnread() {
  unreadMessages += 1;

  if (unreadMessages >= 10) {
    chrome.action.setBadgeText({text: "10+"}); 
  } else {
    chrome.action.setBadgeText({text: unreadMessages + ""}); 
  }
    
}

function removeUnread() {
  unreadMessages = 0;
  chrome.action.setBadgeText({text: ""}); 
}