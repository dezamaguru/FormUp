import '../StudentPage/StudentPage.css';
import SideBar from "../SideBar/SideBar";
import { generateToken } from "../Notificari/firebase";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import Map from '../Maps/GoogleMaps';
import { useNavigate } from "react-router-dom";

function SecretarRole() {
  useFirebaseNotifications();
  const axiosPrivate = useAxiosPrivate();
  const [fcmToken, setFcmToken] = useState("");
  const [notificari, setNotificari] = useState("");
  const navigate = useNavigate();

  const fetchFcmToken = async () => {
    try {
      const token = await generateToken();
      await axiosPrivate.post('/users/fcm-token', { token });
      setFcmToken(token);
      console.log("Token FCM generat:", token);
    } catch (err) {
      console.error("Error getting FCM token: ", err);
    }
  }

  const getNotificari = async () => {
    try {
      const notificari = await axiosPrivate.get('/notificari/');
      setNotificari(notificari.data);
    } catch (err) {
      console.error("Error getting notifications: ", err);
    }

  }

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.post('/notificari/delete', {
        id_notificare: id
      });
      getNotificari();
      toast.success("Notificare stearsa!", {
        position: "top-right"
      });

    } catch (err) {
      console.error("Error deleting notification: ", err);
    }
  }

  useEffect(() => {
    fetchFcmToken();
    getNotificari();
  }, []);

  return (
    <div className="student-page">
      <ToastContainer />
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="header">
          <h1>Welcome!</h1>
          <div className="header-buttons">
            <button className="icon-button" aria-label="Notifications">🔔</button>
            <button className="icon-button avatar-button" aria-label="Profile">👤</button>
          </div>
        </header>

        {/* Dashboard sections */}
        <div className="dashboard">
          {/* Classes */}
          <section className="card " style={{ gridArea: "classes" }}>
            <h3>Notificari</h3>
            {Array.isArray(notificari) && notificari.length > 0 ? (
              (notificari.map((notificare) => (
                <div className="class-card"
                  key={notificare.id_notificare}
                  onClick={() => navigate(notificare.link_destinatie)}
                >
                  <strong>{notificare.titlu}</strong>
                  <p>{notificare.mesaj}</p>
                  <small>{notificare.creat_la}</small>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // oprește propagarea către .class-card
                      handleDelete(notificare.id_notificare);
                    }}>Sterge</button>
                </div>
              )))
            ) : (
              <p>Nu exista notificari</p>
            )}

          </section>

          <section className="card news" style={{ gridArea: "news" }}>
            <Map />
          </section>
        </div>
      </main>
    </div>
  );
}

export default SecretarRole;