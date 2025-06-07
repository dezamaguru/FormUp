import { useState } from 'react';
import './AddAdeverinta.css';
import { axiosPrivate } from '../../api/axios';
import './AdeverintePage.js';
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";

const AddAdeverinta = ({ onAdd }) => {
  useFirebaseNotifications();
  const [name, setName] = useState('');
  const [tipAdeverinta, setTipAdeverinta] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !tipAdeverinta) {
      alert('Te rugăm să completezi toate câmpurile!');
      return;
    }

    try {
      const res = await axiosPrivate.post('/adeverinte/upload', {
        name,
        tipAdeverinta
      });

      console.log("Adeverinta :", res.data);
      setName('');
      setTipAdeverinta('');

      if (onAdd) onAdd();
      toast.success("Solicitarea a fost trimisă cu succes!", {
        position: "top-right"
      });

    } catch (err) {
      console.error('Eroare la trimiterea cererii:', err.response?.data);
    }

    try {
      var data = {
        title: "Notificare adeverinta",
        body: "Adeverinta primita"
      };

      const response = await axiosPrivate.post('/firebase/send-notification',
         data);
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
  };

  return (
    <div className="proof-form">
      <ToastContainer />
      <h2 className="form-title">Date adeverință</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <select
            value={tipAdeverinta}
            onChange={(e) => setTipAdeverinta(e.target.value)}
            className="form-select"
          >
            <option value="" disabled hidden>Alege tipul adeverinței</option>
            <option value="Agenția Județeană Pentru Inspecția Socială">Agenția Județeană Pentru Inspecția Socială</option>
            <option value="Casa de Pensii">Casa de Pensii</option>
            <option value="CNAS">CNAS</option>
            <option value="D.G.A.S.P.C.">D.G.A.S.P.C.</option>
            <option value="Locul de muncă">Locul de muncă</option>
            <option value="Locul de muncă al părintelui">Locul de muncă al părintelui</option>
            <option value="Medicul de familie">Medicul de familie</option>
            <option value="Practică">Practică</option>
            <option value="Primărie">Primărie</option>
            <option value="Servicul de cazare studenți - Direcția Socială">Servicul de cazare studenți - Direcția Socială</option>
            <option value="Spital">Spital</option>
            <option value="Transport">Transport</option>
            <option value="Tribunal">Tribunal</option>
            <option value="Work and Travel">Work and Travel</option>
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Nume complet student"
              required
            />
          </div>

          {/*
          <div className="form-group">
            <input id="email" type="email" placeholder="Email student" />
          </div>

           <div className="form-group">
            <input id="facultyInput" type="text" placeholder="Facultate" />
          </div>

          <div className="form-group">
            <input id="program" type="text" placeholder="Program de studiu" />
          </div>

          <div className="form-group">
            <input id="year" type="text" placeholder="An universitar" />
          </div>

          <div className="form-group">
            <input id="studyYear" type="text" placeholder="An studiu" />
          </div>

          <div className="form-group">
            <input id="degree" type="text" placeholder="Studii universitare" />
          </div>

          <div className="form-group">
            <input id="mode" type="text" placeholder="Formă de învățământ" />
          </div>

          <div className="form-group">
            <input id="funding" type="text" placeholder="Formă finanțare" />
          </div>

          <div className="form-group">
            <input id="group" type="text" placeholder="Grupa" />
          </div> */}
        </div>

        <button type="submit" className="submit-btn">
          Trimite cerere
        </button>
      </form>
    </div>
  );
};

export default AddAdeverinta;