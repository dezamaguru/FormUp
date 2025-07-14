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
    </div>
  );
}

export default AdminPage;
