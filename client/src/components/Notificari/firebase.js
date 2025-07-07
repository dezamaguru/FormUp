// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7P42shpHOpMJi_j6CMLaPFtiIX6XLgnM",
  authDomain: "formup-462219.firebaseapp.com",
  projectId: "formup-462219",
  storageBucket: "formup-462219.firebasestorage.app",
  messagingSenderId: "214551502188",
  appId: "1:214551502188:web:a67d13612b2ebcaad3e749",
  measurementId: "G-YZ80MVTF4K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if(permission === "granted"){
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
    });
    console.log(token);
    return token;
    } else {
      throw new Error("Notification not granted");
    }
};

export const onMessageListener = () =>{
  return new Promise((resolve) => {
    onMessage(messaging, (payload)  => {
      resolve(payload);
    })
  })
}