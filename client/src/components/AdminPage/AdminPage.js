import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../SideBar/SideBar";
import "./AdminPage.css"; 

function AdminPage() {
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axiosPrivate.get('/users/getUser');
      setUser(res.data);
    } catch (err) {
      console.error("Eroare la preluarea utilizatorului:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="admin-home-page">
      <SideBar />
      <main className="admin-home-content">
        <h1>Panou de administrare!</h1>
        {user && (
          <div className="admin-info-card">
            <p><strong>Nume:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.type}</p>
          </div>
        )}
        <div className="admin-actions">
          <p>Accesează funcționalitățile de mai jos:</p>
          <ul>
            <li> Gestionare utilizatori</li>
            <li> Adaugă utilizatori</li>
            <li> Statistici</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
