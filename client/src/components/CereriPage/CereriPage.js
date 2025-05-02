import './CereriPage.css';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import useAuth from "../../hooks/useAuth";

function Cereri() {
  const [cereri, setCereri] = useState([]);
  const [solicitari, setSolicitari] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCereri = async () => {
      try {
        const response = await axiosPrivate.get("/cereri", {
          signal: controller.signal,
        });
        if (isMounted) {
          setCereri(response.data);
        }
      } catch (error) {
        if (error.name === "CanceledError") {
          console.log("Request canceled:", error.message); // Handle cancellation gracefully
        } else {
          console.error(error.response.data);
          navigate("/", { state: { from: location }, replace: true });
        }
      }
    };

    const getSolicitari = async () => {
      try {
        const res = await axiosPrivate.get("/solicitari", {
          signal: controller.signal,
        });

        if (isMounted) {
          console.log("Solicitari primite:", res.data);
          setSolicitari(res.data);
        }
      } catch (err) {
        if (err.name === "CanceledError") {
          console.log("Request canceled:", err.message);
        } else {
          console.error(err.res.data);
          navigate("/", { state: { from: location }, replace: true });
        }
      }
    }

    getCereri();
    getSolicitari();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file || !type)
      return alert("Completează campurile și alege un fișier.");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", file);

    try {
      const res = await axiosPrivate.post("/cereri/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Adăugăm noua cerere direct în state
      setCereri((prev) => [...prev, res.data.cerere]);

      // Resetăm formularul
      setTitle("");
      setType("");
      setFile(null);
      navigate("/cereri", { state: { from: location }, replace: true });
    } catch (err) {
      console.error("Eroare completă:", err);
      console.error("Răspuns server:", err.response?.data);
      alert(err.response?.data?.message || "Eroare la upload");
    }
  };

  return (
    <div className="student-page">
      <SideBar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="header">
          <h1>Welcome!</h1>
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

          <div className="dashboard-cereri" style={{ gridArea: "cereri" }}>
            <section className="card-cereri">
              {Array.isArray(cereri) && cereri.length > 0 ? (
                cereri.map((cerere) => (
                  <div
                    key={cerere.id_cerere}
                    className="cerere-card"
                    onClick={() => navigate(`/cereri/${cerere.id_cerere}`)}
                  >
                    <strong>{cerere.title}</strong>
                    <p>{cerere.type}</p>
                  </div>
                ))
              ) : (
                <p>Nu există cereri disponibile.</p>
              )}
            </section>

            {/* Solicitari */}
            <section className="card-cereri-istoric" style={{ gridArea: "istoric" }}>
              <strong>Istoric solicitari</strong>
              {Array.isArray(solicitari) && solicitari.length > 0 ? (
                solicitari.map((solicitare) => (
                  <div
                    key={solicitare.id_solicitare}
                    className='istoric-card'
                    onClick={() => navigate(`/cereri/solicitari/${solicitare.id_solicitare}`)}>
                    <strong>Solicitare: {solicitare.id_solicitare}</strong>
                    <p>Status: {solicitare.status}</p>
                  </div>
                ))
              ) : (
                <p>Nu exista solicitari</p>
              )}
            </section>
          </div>
        )}

        {auth?.type === "secretar" && (
          <div className="dashboard-cereri" style={{ gridArea: "cereri" }}>
            <section className="card-cereri-istoric" style={{ gridArea: "istoric" }}>
              <strong>Solicitari </strong>
              {Array.isArray(solicitari) && solicitari.length > 0 ? (
                solicitari.map((solicitare) => (
                  <div
                    key={solicitare.id_solicitare}
                    className='istoric-card'
                    onClick={() => navigate(`/cereri/solicitari/${solicitare.id_solicitare}`)}>
                    <strong>Solicitare: {solicitare.id_solicitare}</strong>
                    <p>Status: {solicitare.status}</p>
                  </div>
                ))
              ) : (
                <p>Nu exista solicitari</p>
              )}
            </section>

            <section className="card-cereri">
              <div className="card-upload-cerere">
                <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
                  <input
                    type="text"
                    placeholder="Titlu cerere"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="" disabled hidden>
                      Alege tipul cererii
                    </option>
                    <option value="licenta">Licenta</option>
                    <option value="master">Master</option>
                    <option value="comun">Comun</option>
                    <option value="altele">Altele</option>
                  </select>

                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                  <button type="submit"> Încarcă cerere </button>
                </form>
              </div>

              {Array.isArray(cereri) && cereri.length > 0 ? (
                cereri.map((cerere) => (
                  <div
                    key={cerere.id_cerere}
                    className="cerere-card"
                    onClick={() => navigate(`/cereri/${cerere.id_cerere}`)}
                  >
                    <strong>{cerere.title}</strong>
                    <p>{cerere.type}</p>
                  </div>
                ))
              ) : (
                <p>Nu există cereri disponibile.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cereri;
