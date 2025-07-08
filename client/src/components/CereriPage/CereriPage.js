import './CereriPage.css';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import useAuth from "../../hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import Paginator from "../Paginator/Paginator";
import Header from '../Header/Header';

function Cereri() {
  useFirebaseNotifications();
  const [cereri, setCereri] = useState([]);
  const [solicitari, setSolicitari] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCerereId, setActiveCerereId] = useState(null);
  const [activeCerereDetails, setActiveCerereDetails] = useState(null);


  const getSolicitari = async () => {
    try {
      const res = await axiosPrivate.get(`/solicitari?page=${page}&pageSize=${pageSize}`);
      setSolicitari(res.data.solicitari || []);
      setTotalCount(res.data.total || 0);

    } catch (err) {
      if (err.name === "CanceledError") {
        console.log("Request canceled:", err.message);
      } else {
        console.error(err.response?.data);
        navigate("/", { state: { from: location }, replace: true });
      }
    }
  };

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

    getCereri();
    getSolicitari();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location, page, pageSize]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file || !type)
      return alert("Completează campurile și alege un fișier.");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", file);

    try {
      await axiosPrivate.post(`/cereri/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Reîncarcă lista de cereri tip după adăugare cu succes
      const response = await axiosPrivate.get("/cereri");
      setCereri(response.data);
      setTitle("");
      setType("");
      setFile(null);
      toast.success("Cerere tip adăugată cu succes!", { position: "top-right" });
    } catch (err) {
      alert("Eroare la încărcare cerere!");
      console.error(err);
    }
  };

  const fetchCerereDetails = async (id) => {
    try {
      const res = await axiosPrivate.get(`/cereri/${id}`);
      setActiveCerereDetails(res.data);
    } catch (err) {
      console.error("Eroare la preluarea cererii:", err);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      var res = null;

      if (title === "Cerere retragere licenta" || title === "Cerere retragere master") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-retragere`, {
          responseType: "blob",
        });
      };

      if (title === "Cerere intrerupere studii licenta") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-intrerupere`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere bursa sociala") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-bursa`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere marire nota") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-marire`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere solicitare situatie scolara") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-situatie`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere contestatie") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-contestatie`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere fisa de lichidare") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-lichidare`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere mobilitati definitive (in cadrul facultatii)") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-mobilitate`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere mobilitati definitive (intre universitati)") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-mobilitate-universitati`, {
          responseType: "blob",
        });
      }

      if (title === "Cerere intrerupere studii master") {
        res = await axiosPrivate.get(`/cereri/${id}/generare-cerere-intrerupere-master`, {
          responseType: "blob",
        });
      }
      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = title;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Eroare la descărcarea cererii personalizate:", err);
      alert("A apărut o eroare la generarea documentului.");
    }
  };

  const handleAddSolicitare = async (id) => {

    try {

      const res = await axiosPrivate.post(`/cereri/${id}/upload`);

      setFile(null);
      console.log("Solicitare adăugată cu succes!", res.data);

      toast.success("Solicitarea a fost trimisă!", {
        position: "top-right"
      });

      getSolicitari();

    } catch (err) {
      console.error("Eroare completă:", err);
      console.error("Răspuns server:", err.response?.data);
    }
  }

  return (
    <div className="cereri-page">
      <ToastContainer />
      <SideBar />

      {/* Main Content */}
      <main className="main-content-cereri">
        <Header />

        {auth?.type === "student" && (
          <div className="dashboard-cereri" style={{ gridArea: "cereri" }}>
            <section className="card-cereri">
              {Array.isArray(cereri) && cereri.length > 0 ? (
                cereri.map((cerere) => (
                  <div
                    key={cerere.id_cerere}
                    className="cerere-card"
                    onClick={() => {
                      const alreadyOpened = activeCerereId === cerere.id_cerere;
                      setActiveCerereId(alreadyOpened ? null : cerere.id_cerere);
                      if (!alreadyOpened) fetchCerereDetails(cerere.id_cerere);
                    }}
                  >
                    <strong>{cerere.title}</strong>
                    <p>{cerere.type}</p>

                    {activeCerereId === cerere.id_cerere && activeCerereDetails && (
                      <div className="cerere-expand-box">
                        <button onClick={() => handleDownload(cerere.id_cerere, cerere.title)}>
                          Descarcă cerere
                        </button>
                        <button onClick={() => handleAddSolicitare(cerere.id_cerere)}>
                          Adaugă solicitare
                        </button>
                      </div>
                    )}
                  </div>

                ))
              ) : (
                <p>Nu există cereri disponibile.</p>
              )}
            </section>

            {/* Solicitari */}
            <section className="card-cereri-istoric" style={{ gridArea: "istoric" }}>
              <strong>Solicitari</strong>
              {Array.isArray(solicitari) && solicitari.length > 0 ? (
                solicitari.map((solicitare) => (
                  <div
                    key={solicitare.id_solicitare}
                    className='istoric-card'
                    onClick={() => navigate(`/cereri/solicitari/${solicitare.id_solicitare}`)}>
                    <strong>Solicitare pentru {solicitare.Cereri.title}</strong>
                    <p>
                      Status: <span className={`status-solicitare ${solicitare.status.toLowerCase()}`}>
                        {solicitare.status}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p>Nu exista solicitari</p>
              )}

              <Paginator
                page={page}
                pageSize={pageSize}
                totalRecords={totalCount}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(Number(newSize));
                  setPage(0);
                }}
              />

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
                    <strong>Solicitare pentru: {solicitare.Cereri?.title}</strong>
                    <p>Student: {solicitare.User?.firstName} {solicitare.User?.lastName}</p>
                    <p>
                      Status: <span className={`status-solicitare ${solicitare.status.toLowerCase()}`}>
                        {solicitare.status}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p>Nu exista solicitari</p>
              )}

              <Paginator
                page={page}
                pageSize={pageSize}
                totalRecords={totalCount}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(Number(newSize));
                  setPage(0);
                }}
              />
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
                    onClick={() => {
                      const alreadyOpened = activeCerereId === cerere.id_cerere;
                      setActiveCerereId(alreadyOpened ? null : cerere.id_cerere);
                      if (!alreadyOpened) fetchCerereDetails(cerere.id_cerere);
                    }}
                  >
                    <strong>{cerere.title}</strong>
                    <p>{cerere.type}</p>

                    {activeCerereId === cerere.id_cerere && activeCerereDetails && (
                      <div className="cerere-expand-box">
                        <button onClick={() => handleDownload(cerere.id_cerere, cerere.title)}>
                          Descarcă cerere
                        </button>
                        <button
                          className="delete-btn-cerere"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await axiosPrivate.post(`/cereri/${cerere.id_cerere}/delete`, { id_cerere: cerere.id_cerere });
                              toast.success("Cerere tip ștearsă cu succes!", { position: "top-right" });
                              const response = await axiosPrivate.get("/cereri");
                              setCereri(response.data);
                            } catch (err) {
                              toast.error("Eroare la ștergerea cererii tip!", { position: "top-right" });
                              console.error(err);
                            }
                          }}
                        >Șterge</button>
                      </div>
                    )}
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
