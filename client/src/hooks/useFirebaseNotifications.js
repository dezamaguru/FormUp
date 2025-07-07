import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../components/Notificari/firebase";
import { toast } from "react-toastify";

const useFirebaseNotifications = () => {
  useEffect(() => {
    // Use onMessage directly, which returns an unsubscribe function
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Received foreground message", payload);
      console.log("Notification title:", payload?.notification?.title);
      console.log("Notification body:", payload?.notification?.body);
      
      toast(
        <div>
          <strong>{payload?.notification?.title || "No title"}</strong>
          <br />
          <strong>{payload?.notification?.body || "No body"}</strong>
        </div>,
        { position: "top-right" }
      );
    });
    return () => unsubscribe(); 
  }, []);
};

export default useFirebaseNotifications;
