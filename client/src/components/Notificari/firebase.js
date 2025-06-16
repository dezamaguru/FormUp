// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA53b7dJL8zAmzUXwsZZ21WVDU2a4zs7OU",
  authDomain: "formup-8d3b9.firebaseapp.com",
  projectId: "formup-8d3b9",
  storageBucket: "formup-8d3b9.firebasestorage.app",
  messagingSenderId: "190616113374",
  appId: "1:190616113374:web:65867a4d846e98a346f24f",
  measurementId: "G-FHTL1J1SLW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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