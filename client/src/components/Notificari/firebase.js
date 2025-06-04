// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging"

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
        vapidKey: "BIIdLCRQgFmhg0SUtPcDX3k-FBktNkPcm1IcmU1YD0amfwI_NkJwUoTphCR4alZHAUu1Btv8tj6gn59QXfGgGKo"
    });
    console.log(token);
    }
};