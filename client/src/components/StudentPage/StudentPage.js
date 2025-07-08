import './StudentPage.css';
import SideBar from '../SideBar/SideBar';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from '../Maps/CustomMap';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import Header from '../Header/Header';

function StudentPage() {
  const axiosPrivate = useAxiosPrivate();
  const [notificari, setNotificari] = useState("");
  const navigate = useNavigate();

  const getNotificari = async () => {
    try {
      const notificari = await axiosPrivate.get('/notificari/');
      setNotificari(notificari.data);
    } catch (err) {
      console.error("Error getting notifications: ", err);
    }
  }

  const modificaStare = async (id_notificare) => {
    try {
      await axiosPrivate.post(`/notificari/mark-as-read/${id_notificare}`);
      getNotificari();
    } catch (err) {
      console.error("Eroare la marcarea notificării ca citită:", err);
    }
  }

  useEffect(() => {
    getNotificari();
  }, []);

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

  return (
    <div className="student-page">
      <ToastContainer />
      <SideBar />

      {/* Main Content */}
      <main className="main-content">
        <Header />

        <div className="dashboard">
          <section className="card classes" style={{ gridArea: "classes" }}>
            <h3>Notificari</h3>
            {Array.isArray(notificari) && notificari.length > 0 ? (
              (notificari.map((notificare) => (
                <div className={`notificare-card ${!notificare.citita ? 'necitita' : ''}`}
                  key={notificare.id_notificare}
                  onClick={() => {
                    navigate(notificare.link_destinatie)
                    modificaStare(notificare.id_notificare)
                  }
                  }
                >
                  <strong>{notificare.titlu}</strong>
                  <p>{notificare.mesaj}</p>
                  <small>
                    {format(new Date(notificare.creat_la), "dd MMMM yyyy, HH:mm", { locale: ro })}
                  </small>

                  <button className='delete-btn'
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
            <GoogleMapComponent />
          </section>

        </div>
      </main>
    </div>
  );
}

export default StudentPage;
