// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, query, orderBy, limit  } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js'

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
pullLast10();

function pullLast10() {
  var c = collection(db, "messages")
  var q = query(c, orderBy("date"), limit(10));

  getDocs(q).then((res) => {
    res.forEach((doc) => {
      var message = {};
      message.user = doc.data().user;
      message.text = doc.data().message;
      message.date = doc.data().date;
      
      message_cache.push(message);
    });
  });

  console.log(message_cache);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "getMessageCache")
      sendResponse({messageCache: message_cache});
  }
);


/*
Ablauf:
 - Bei Start: Lade die letzten 10 Nachichten in ein JSON Objekt, dass dann immer angezeigt wird, wenn das Popup geöffnet wird. 
 - Bei Hook: Füge Nachicht in JSON Objekt hinzu und aktualisier Tabelle in Popup 
 - Bei Send: Füge Nachicht in JSON Objekt hinzu, pushe in Database und aktualisier Tabelle in Popup
*/

