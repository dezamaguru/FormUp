import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import SideBar from "../SideBar/SideBar";
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";

const AdeverintaSolicitata = () => {
  useFirebaseNotifications();
  const { id } = useParams();
  const [adeverinta, setAdeverinta] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);


  const getOneAdeverinta = async () => {
    try {
      const res = await axiosPrivate.get(`/adeverinte/${id}`);
      setAdeverinta(res.data);
      //console.log(res.data);
    } catch (err) {
      console.error("Eroare la preluarea adeverintei:", err);
    }
  };

  useEffect(() => {
    getOneAdeverinta();
    fetchPdfPreview();
  }, [id, axiosPrivate]);


  const fetchPdfPreview = async () => {
    try {
      const res = await axiosPrivate.get(`/adeverinte/${id}/download`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("Eroare la generarea preview-ului:", err);
    }
  };


  const handleUploadAdeverintaSolicitata = async (e) => {
    e.preventDefault();
    if (!file) return alert("Incarca fisierul!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosPrivate.post(
        `/adeverinte/${id}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFile(null);
      console.log("Fisierul incarcat:", res.data);
      getOneAdeverinta();

      toast.success(
        <div>
          <div>
            Notification sent
          </div>
        </div>,
        { position: 'top-right' }
      )

      //alert("Fisier incarcat cu succes");
    } catch (err) {
      console.error("Eroare completă:", err);
      console.error("Răspuns server:", err.response?.data);
      alert(err.response?.data?.message || "Eroare la upload");
    }
  };

  const handleDownloadAdeverinta = async () => {
    try {
      const res = await axiosPrivate.get(`/adeverinte/${id}/download`, {
        responseType: "blob",
      });

      if (!res.data) {
        throw new Error("Nu s-au primit date de la server");
      }

      let filename = "adeverinta.pdf"; // fallback
      const disposition = res.headers["content-disposition"];
      console.log("Filename", disposition);
      console.log(res.headers["content-disposition"]);

      if (disposition && disposition.includes("filename=")) {
        const filenameMatch = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]*)["']?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }


      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = adeverinta.filename;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Eroare la descarcarea adeverintei: ", err);
      alert(
        "A apărut o eroare la descărcarea fișierului. Vă rugăm să încercați din nou."
      );
    }
  };

  return (
    <div className="student-page">
      <ToastContainer />
      <SideBar />

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
          <div className="adeverinta-layout">
            <section className="detalii-adeverinta-container">
              <div>
                {adeverinta ? (
                  <>
                    <h2>Detalii Adeverință</h2>
                    <div className="detail-row">
                      <span className="detail-label">Tip Adeverință:</span>
                      <span>{adeverinta.tip_adeverinta}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Nume Student:</span>
                      <span>{adeverinta.nume_student}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`status-badge ${adeverinta.status.toLowerCase()}`}>
                        {adeverinta.status}
                      </span>
                    </div>

                    <button onClick={handleDownloadAdeverinta}>
                      Descarcă adeverința
                    </button>
                  </>
                ) : (
                  <p>Nu exista detalii pentru aceasta deverinta</p>
                )}
              </div>
            </section>

            <section className="previz-pdf-container">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Previzualizare PDF"
                  width="100%"
                  height="500px"
                  style={{ borderRadius: "12px", border: "1px solid #cbd5e1" }}
                />
              ) : (
                <p>PDF-ul nu este disponibil pentru previzualizare.</p>
              )}
            </section>
          </div>
        )}

        {auth?.type === "secretar" && (

          <div className="adeverinta-layout">
            <section className="detalii-adeverinta-container">
              <div>
                {adeverinta ? (
                  <>
                    <h2>Detalii Adeverință</h2>
                    <div className="detail-row">
                      <span className="detail-label">Tip Adeverință:</span>
                      <span>{adeverinta.tip_adeverinta}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Nume Student:</span>
                      <span>{adeverinta.nume_student}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`status-badge ${adeverinta.status.toLowerCase()}`}>
                        {adeverinta.status}
                      </span>
                    </div>

                    {/* <form
                      onSubmit={handleUploadAdeverintaSolicitata}
                      style={{ marginBottom: "20px" }}
                    >
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                      />
                      <button type="submit">Incarca adeverinta</button>
                    </form> */}
                  </>
                ) : (
                  <p>Nu exista detalii pentru aceasta deverinta</p>
                )}
              </div>
            </section>

            <section className="previz-pdf-container">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Previzualizare PDF"
                  width="100%"
                  height="500px"
                  style={{ borderRadius: "12px", border: "1px solid #cbd5e1" }}
                />
              ) : (
                <p>PDF-ul nu este disponibil pentru previzualizare.</p>
              )}
            </section>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdeverintaSolicitata;
