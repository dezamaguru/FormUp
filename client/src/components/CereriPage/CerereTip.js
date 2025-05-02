import "./CerereTip.css";
import SideBar from "../SideBar/SideBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function CerereTip() {
    const { id } = useParams();
    const [cerereTip, setCerereTip] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [file, setFile] = useState(null);

    useEffect(() => {
        const getOneCerere = async () => {
            try {
                const res = await axiosPrivate.get(`/cereri/${id}`);
                setCerereTip(res.data);
            } catch (err) {
                console.error("Eorare la preluare cerere:", err);
            }
        };

        getOneCerere();
    }, [id, axiosPrivate]);


    const handleDownload = async (id) => {
        try {
            const res = await axiosPrivate.get(`/cereri/${id}/download`, {
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

            if (!filename) {
                filename = `cerere_${id}`; // Fallback pentru numele fișierului
            }

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
            console.error("Eroare la descărcare:", err);
            alert(
                "A apărut o eroare la descărcarea fișierului. Vă rugăm să încercați din nou."
            );
        }
    };

    const handleAddSolicitare = async (id) => {

        if (!file) {
            return alert("Încarcă fișierul!");
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axiosPrivate.post(`/cereri/${id}/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setFile(null);
            console.log("Solicitare adăugată cu succes!", res.data);
            alert("Fișier încărcat cu succes");

        } catch (err) {
            console.error("Eroare completă:", err);
            console.error("Răspuns server:", err.response?.data);
            alert(err.response?.data?.message || "Eroare la încărcare");
        }
    }

    return (
        <div className="student-page">
            <SideBar />

            <main className="main-content">
                {/* Top bar */}
                <header className="header">
                    <h1>Welcome, Student!</h1>
                    <div className="header-buttons">
                        <button className="icon-button" aria-label="Notifications">
                            🔔
                        </button>
                        <button className="icon-button avatar-button" aria-label="Profile">
                            👤
                        </button>
                    </div>
                </header>

                {auth?.type === 'student' && (
                    <div>
                        {cerereTip ? (
                            <>
                                <p>Detalii cerere</p>
                                <p>Nume: {cerereTip.title}</p>
                                <p>Tip: {cerereTip.type}</p>
                                <button onClick={() => handleDownload(cerereTip.id_cerere)}>
                                    Descarcă
                                </button>

                                <form onSubmit={(e) => { e.preventDefault(); handleAddSolicitare(cerereTip.id_cerere) }}>
                                    <input type="file" onChange={(e) => setFile(e.target.files[0])} required />

                                    <button type="submit">Incarca cerere</button>
                                </form>

                            </>
                        ) : (
                            <p>Nu exista detalii pentru aceasta cerere.</p>
                        )
                        }
                    </div>
                )}

                {auth?.type === 'secretar' && (
                    <div>
                        {cerereTip ? (
                            <>
                                <p>Detalii cerere</p>
                                <p>Nume: {cerereTip.title}</p>
                                <p>Tip: {cerereTip.type}</p>
                                <button onClick={() => handleDownload(cerereTip.id_cerere)}>
                                    Descarcă
                                </button>

                                <button>Modifica cerere</button>
                            </>
                        ) : (
                            <p>Nu exista detalii pentru aceasta cerere.</p>
                        )
                        }
                    </div>
                )}
            </main>
        </div>
    );
}

export default CerereTip;
