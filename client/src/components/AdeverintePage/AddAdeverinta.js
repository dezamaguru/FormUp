import React from 'react';
import { useState } from 'react';
import './AddAdeverinta.css';
import { axiosPrivate } from '../../api/axios';

const AddAdeverinta = () => {
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
                name: name,
                tipAdeverinta: tipAdeverinta
            });
            
            console.log("Adeverinta :", res.data);
            setName('');
            setTipAdeverinta('');
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
            <option value="adeverinta1">Adeverință 1</option>
            <option value="adeverinta2">Adeverință 2</option>
            <option value="adeverinta3">Adeverință 3</option>
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