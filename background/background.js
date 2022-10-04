// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js'


const firebaseConfig = {
    apiKey: "AIzaSyA0RO5Yujusyw8T1ypBapibhs-qftyw_Tg",
    authDomain: "fh-aachen-chat-room.firebaseapp.com",
    projectId: "fh-aachen-chat-room",
    storageBucket: "fh-aachen-chat-room.appspot.com",
    messagingSenderId: "187380571422",
    appId: "1:187380571422:web:bbbda325ff564737ba7d0f",
    measurementId: "G-4Y704HZKYZ"
};

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

getDocs(collection(db, "messages")).then((res) => {
  res.forEach((doc) => {
    console.log(`${doc.data().user}: ${doc.data().message}`);
  });
});


/*
Ablauf:
 - Bei Start: Lade die letzten 10 Nachichten in ein JSON Objekt, dass dann immer angezeigt wird, wenn das Popup geöffnet wird.
 - Bei Hook: Füge Nachicht in JSON Objekt hinzu und aktualisier Tabelle in Popup 
 - Bei Send: Füge Nachicht in JSON Objekt hinzu, pushe in Database und aktualisier Tabelle in Popup
*/

