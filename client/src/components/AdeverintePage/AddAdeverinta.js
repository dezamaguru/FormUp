import React from 'react';
import { useState } from 'react';
import './AddAdeverinta.css';
import { axiosPrivate } from '../../api/axios';
import './AdeverintePage.js';

const AddAdeverinta = ({ onAdd }) => {
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

    } catch (err) {
      console.error('Eroare la trimiterea cererii:', err.response?.data);
    }
    };

  return (
    <div className="proof-form">
      <h2 className="form-title">Date adeverință</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <select 
            value={tipAdeverinta} 
            onChange={(e) => setTipAdeverinta(e.target.value)} 
            className="form-select"
          >
            <option value="" disabled hidden>Alege tipul adeverinței</option>
            <option value="adeverinta1">Agenția Județeană Pentru Inspecția Socială</option>
            <option value="adeverinta2">Casa de Pensii</option>
            <option value="adeverinta3">CNAS</option>
            <option value="adeverinta3">D.G.A.S.P.C.</option>
            <option value="adeverinta3">Locul de muncă</option>
            <option value="adeverinta3">Locul de muncă al părintelui</option>
            <option value="adeverinta3">Medicul de familie</option>
            <option value="adeverinta3">Practică</option>
            <option value="adeverinta3">Primărie</option>
            <option value="adeverinta3">Servicul de cazare studenți - Direcția Socială</option>
            <option value="adeverinta3">Spital</option>
            <option value="adeverinta3">Transport</option>
            <option value="adeverinta3">Tribunal</option>
            <option value="adeverinta3">Work and Travel</option>
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
          <span className="submit-icon">▶</span>
          Trimite cerere
        </button>
      </form>
    </div>
  );
};

export default AddAdeverinta;