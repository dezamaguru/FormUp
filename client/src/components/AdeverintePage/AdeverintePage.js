import "./AdeverintePage.css";
import { useState } from "react";
import AddAdeverinta from "./AddAdeverinta";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import SideBar from "../SideBar/SideBar";
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";

function AdeverintePage() {
  useFirebaseNotifications();
  const [showDropDown, setShowDropDown] = useState(false);
  const [adeverinte, setAdeverinte] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  const getAdeverinte = async (
    controller = new AbortController(),
    isMounted = true
  ) => {
    try {
      const response = await axiosPrivate.get("/adeverinte", {
        signal: controller.signal,
      });
      if (isMounted) {
        setAdeverinte(response.data);
      }
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Request canceled:", error.message);
      } else {
        console.error(error.response?.data);
        navigate("/", { state: { from: location }, replace: true });
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    getAdeverinte(controller, isMounted);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);

  const handleClick = (id, currentStatus) => {
    navigate(`/adeverinte/${id}`); // navigheaza catre adeverinta solicitata

    if (currentStatus === "Procesare" || currentStatus === "Aprobata") {
      console.log("Statusul nu poate fi schimbat deoarece este deja:", currentStatus);
      return;
    }

    try {
      const res = axiosPrivate.post(`/adeverinte/${id}/status`);
      console.log("Status actualizat:", res.data);
    } catch (err) {
      console.error("Eroare la actualizarea statusului:", err);
    }
  };

  return (
    <div className="student-page">
      <ToastContainer />
      <SideBar />

      <main className="main-content">
        {/* Top bar */}
        <header className="header">
          <h1>Welcome, Student!</h1>
          <div className="header-buttons">
            <button className="icon-button" aria-label="Notifications">
              🔔
            </button>
            <button className="icon-button avatar-button" aria-label="Profile">
              👤
            </button>
          </div>
        </header>

        {auth?.type === "student" && (
          <div>
            <button className="submit-btn" onClick={() => setShowDropDown((prev) => !prev)}>
              Adauga cerere
            </button>
            {showDropDown && <AddAdeverinta onAdd={getAdeverinte} />}

            <p className="section-title">Istoric solicitări</p>
            <div className="history-list">
              {Array.isArray(adeverinte) && adeverinte.length > 0 ? (
                adeverinte.map((adeverinta) => (
                  <div
                    key={adeverinta.id_adeverinta}
                    className="history-card"
                    onClick={() => navigate(`/adeverinte/${adeverinta.id_adeverinta}`)}
                  >
                    <strong>{adeverinta.tip_adeverinta}</strong>
                    <p>{adeverinta.nume_student}</p>
                    <small>{adeverinta.status}</small>
                  </div>
                ))
              ) : (
                <p>Nu există solicitări pentru adeverințe.</p>
              )}
            </div>
          </div>
        )}

        {auth?.type === "secretar" && (
          <div>
            <p className="section-title">Solicitari adeverinte</p>

            <div className="history-list">
              {Array.isArray(adeverinte) && adeverinte.length > 0 ? (adeverinte.map((adeverinta) => (
                <div
                  key={adeverinta.id_adeverinta}
                  className="history-card"
                  onClick={() => handleClick(adeverinta.id_adeverinta, adeverinta.status)}
                >
                  <strong>{adeverinta.tip_adeverinta}</strong>
                  <p>{adeverinta.nume_student}</p>
                  <small>{adeverinta.status}</small>
                </div>
              ))
              ) : (
                <p>Nu exista solicitari pentru adeverinte.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdeverintePage;
