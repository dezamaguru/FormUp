import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import SideBar from "../SideBar/SideBar";

const AdeverintaSolicitata = () => {
  const { id } = useParams(); // extragerea id-ului din URL
  const [adeverinta, setAdeverinta] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [file, setFile] = useState(null);

  const getOneAdeverinta = async () => {
    try {
      const res = await axiosPrivate.get(`/adeverinte/${id}`);
      setAdeverinta(res.data);
    } catch (err) {
      console.error("Eroare la preluarea adeverintei:", err);
    }
  };

  useEffect(() => {

    getOneAdeverinta();
  }, [id, axiosPrivate]);

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

      const disposition = res.headers["content-disposition"];
      let filename;

      if (disposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      // if (!filename) {
      //     console.warn('Numele fișierului lipsește în antetul Content-Disposition.');
      //     filename = `adeverinta_${id}.pdf`; // Fallback mai descriptiv
      // }

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;

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
      <SideBar />

      {auth?.type === "student" && (
        <div>
          {adeverinta ? (
            <>
              <p> Detalii adeverinta:</p>
              <p>
                <strong>Tip Adeverință:</strong> {adeverinta.tip_adeverinta}
              </p>
              <p>
                <strong>Nume Student:</strong> {adeverinta.nume_student}
              </p>
              <p>
                <strong>Status:</strong> {adeverinta.status}
              </p>

              {adeverinta.status === "Aprobata" && (
                <div>
                  <p>
                    <strong>Se poate descarca</strong>
                  </p>
                  <button onClick={() => handleDownloadAdeverinta()}>
                    Descarca adeverinta
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Nu exista detalii pentru aceasta deverinta</p>
          )}
        </div>
      )}

      {auth?.type === "secretar" && (
        <div>
          {adeverinta ? (
            <>
              <p> Detalii adeverinta:</p>
              <p>
                <strong>Tip Adeverință:</strong> {adeverinta.tip_adeverinta}
              </p>
              <p>
                <strong>Nume Student:</strong> {adeverinta.nume_student}
              </p>
              <p>
                <strong>Status:</strong> {adeverinta.status}
              </p>
              <br />
              <br />
              <p>Sectiune de incarcare adeverinte</p>

              <form
                onSubmit={handleUploadAdeverintaSolicitata}
                style={{ marginBottom: "20px" }}
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                <button type="submit">Incarca adeverinta</button>
              </form>
            </>
          ) : (
            <p>Nu exista detalii pentru aceasta deverinta</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdeverintaSolicitata;
