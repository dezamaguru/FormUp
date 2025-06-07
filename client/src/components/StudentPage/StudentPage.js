import './StudentPage.css';
import SideBar from '../SideBar/SideBar';
import { useEffect, useState } from 'react';
import { generateToken} from "../Notificari/firebase";
import { ToastContainer, toast } from 'react-toastify';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";

function StudentPage() {
  useFirebaseNotifications();
  const axiosPrivate = useAxiosPrivate();
  const [fcmToken, setFcmToken] = useState("");

  const fetchFcmToken = async () => {
    try {
      const token = await generateToken();
      console.log("Token FCM generat:", token);
    
      const response = await axiosPrivate.post('/users/fcm-token', { token });
      console.log("Răspuns la salvarea token-ului:", response.data);
      
      setFcmToken(token);
    } catch (err) {
      console.error("Eroare la generarea/salvarea token-ului FCM:", err);
      if (err.message === "Notification not granted") {
        console.error("Utilizatorul nu a acordat permisiunea pentru notificări");
      }
    }
  }

  useEffect(() => {
    fetchFcmToken();
  }, []);

  const handlePushNotification = async () => {
    try {
      var data = {
        title: "Test",
        body: "notificare test de la student",
        deviceToken: "fYLyQN5NAXoaMqPq6x3RjS:APA91bGePzcCGCbzzNIUaayrJEyjndrrEzox9mm6Y8WIgr1bDON7hVENUOowTRCSpFzKBmfkL0xcrPDBpxHLNA4bOr_9Yc1ZzzBsMdwZfWdC2kDh5w9dhI8"
      };
      const response = await axiosPrivate.post('/firebase/send-notification', data);
      console.log(response);
      if (response.status === 200) {
        toast.success(
          <div>
            <div>
              Notification sent
            </div>
          </div>,
          { position: 'top-right' }
        )
      } else {
        toast.error(
          <div>
            <div>
              Failed to send notification
            </div>
          </div>,
          { position: 'top-right' }
        )
      }
    } catch (err) {
      console.error("Error at sending notification:", err);
    }
  }


  return (
    <div className="student-page">
      <ToastContainer />
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="header">
          <h1>Welcome, Student!</h1>
          <div className="header-buttons">
            <button className="icon-button" aria-label="Notifications">🔔</button>
            <button className="icon-button avatar-button" aria-label="Profile">👤</button>
          </div>
        </header>

        {/* Dashboard sections */}
        <div className="dashboard">
          {/* Classes */}
          <section className="card classes" style={{ gridArea: "classes" }}>
            <h3>Classes for the day</h3>
            <div className="class-card">
              <strong>Mathematics</strong>
              <p>Professor Joe</p>
              <small>5/2/22</small>
            </div>
            <div className="class-card">
              <strong>Physics</strong>
              <p>Professor John</p>
              <small>5/2/22</small>
            </div>
            <div className="class-card">
              <strong>Chemistry</strong>
              <p>Professor Matt</p>
              <small>5/2/22</small>
            </div>
          </section>

          {/* News */}
          <section className="card news" style={{ gridArea: "news" }}>
            <h3>News & Updates</h3>
            <div className="news-box">
              <p>Universities to announce exams</p>
              <button className="read-more"
                onClick={handlePushNotification}
              >Send</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentPage;
