import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../SideBar/SideBar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './AddUser.css';

function AddUser() {
  const axiosPrivate = useAxiosPrivate();
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    type: "",
    program_studiu: null,
    an_studiu: null,
    grupa: null,
    forma_finantare: null,
    forma_invatamant: null,
    facultate: null
  });

  useEffect(() => {
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === "type") setSelectedType(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lastName || !formData.firstName || !formData.email || !formData.password || !formData.type) {
      toast.error("Completează toate câmpurile obligatorii!");
      return;
    }

    try {
      await axiosPrivate.post("/register", formData);
      toast.success("Utilizator adăugat cu succes!");
      setFormData({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        type: "",
        program_studiu: "",
        an_studiu: "",
        grupa: "",
        forma_finantare: "",
        forma_invatamant: "",
        facultate: ""
      });
      setSelectedType("");
    } catch (err) {
      console.error(err);
      toast.error("Eroare la adăugare utilizator!");
    }
  };

  return (
    <div className="addUserPage">
      <ToastContainer />
      <SideBar />
      <div className="form-container">
        <h2>Adaugă utilizator</h2>
        <form className="add-user-form" onSubmit={handleSubmit}>
          <label>Nume:</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} required />

          <label>Prenume:</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} required />

          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label>Parolă:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />

          <label>Rol:</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Selectează rolul</option>
            <option value="student">Student</option>
            <option value="secretar">Secretar</option>
            <option value="admin">Admin</option>
          </select>

          {(selectedType === "student" || selectedType === "secretar") && (
            <>
              <label>Program de studiu:</label>
              <select name="program_studiu" value={formData.program_studiu} onChange={handleChange} required>
                <option value="">Selectează programul</option>
                <option value="licenta">Licență</option>
                <option value="master">Master</option>
              </select>

              <label>An studiu:</label>
              <input name="an_studiu" type="number" min="1" max="6" value={formData.an_studiu} onChange={handleChange} required />
            </>
          )}

          {selectedType === "student" && (
            <>
              <label>Grupă:</label>
              <input name="grupa" value={formData.grupa} onChange={handleChange} required />

              <label>Forma de finanțare:</label>
              <select name="forma_finantare" value={formData.forma_finantare} onChange={handleChange} required>
                <option value="">Selectează</option>
                <option value="buget">Buget</option>
                <option value="taxa">Taxă</option>
              </select>

              <label>Forma de învățământ:</label>
              <select name="forma_invatamant" value={formData.forma_invatamant} onChange={handleChange} required>
                <option value="">Selectează</option>
                <option value="IF">IF</option>
                <option value="ID">ID</option>
              </select>
            </>
          )}

          {(selectedType === "student" || selectedType === "secretar") && (
            <>
              <label>Facultate:</label>
              <select name="facultate" value={formData.facultate} onChange={handleChange} required>
                <option value="">Selectează</option>
                <option value="Informatica Economica EN">Informatica Economica EN</option>
                <option value="Informatica Economica">Informatica Economica</option>
                <option value="Statistica">Statistica</option>
                <option value="Cibernetica">Cibernetica</option>
              </select>
            </>
          )}

          <button
          className="download-btn" 
          type="submit">Adaugă utilizator</button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
