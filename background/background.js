// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, query, orderBy, limit, onSnapshot, where, Timestamp  } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyA0RO5Yujusyw8T1ypBapibhs-qftyw_Tg",
    authDomain: "fh-aachen-chat-room.firebaseapp.com",
    projectId: "fh-aachen-chat-room",
    storageBucket: "fh-aachen-chat-room.appspot.com",
    messagingSenderId: "187380571422",
    appId: "1:187380571422:web:bbbda325ff564737ba7d0f",
    measurementId: "G-4Y704HZKYZ"
};

var message_cache = []

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var c = collection(db, "messages")
var q = query(c, orderBy("date", "desc"), limit(1));

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "getMessageCache")
      sendResponse({messageCache: message_cache});
    if (request.type === "sendMessage") {
      console.log("!!!!!!!!!!!!!!!!!!!!!")
      addDoc(c, {
        user: request.message.user,
        message: request.message.text,
        date: Timestamp.now()
      }).then(res => {
        console.log("Document written with ID: ", res.id);
      });
    }
  }
);

const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      var message = {};
      message.user = change.doc.data().user;
      message.text = change.doc.data().message;
      message.date = change.doc.data().date;
      
      message_cache.push(message);
      sendMessageToPopup(message);
    }
  });
});

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage({type: "incomingMessage", message: message}, (res) => {});
}

/*
Ablauf:
 - Bei Start: Lade die letzten 10 Nachichten in ein JSON Objekt, dass dann immer angezeigt wird, wenn das Popup geöffnet wird. DONE
 - Bei Hook: Füge Nachicht in JSON Objekt hinzu und aktualisier Tabelle in Popup 
 - Bei Send: Füge Nachicht in JSON Objekt hinzu, pushe in Database und aktualisier Tabelle in Popup
*/

