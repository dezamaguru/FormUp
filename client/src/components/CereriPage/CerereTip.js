import "./CerereTip.css";
import SideBar from "../SideBar/SideBar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";

function CerereTip() {
    useFirebaseNotifications();
    const { id } = useParams();
    const [cerereTip, setCerereTip] = useState(null);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [file, setFile] = useState(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const navigate = useNavigate();

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
            
            toast.success("Solicitarea a fost trimisă!", {
                position: "top-right"
            });
            


        } catch (err) {
            console.error("Eroare completă:", err);
            console.error("Răspuns server:", err.response?.data);
            alert(err.response?.data?.message || "Eroare la încărcare");
        }
    }

    const handleModificaCerere = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", title);
        formData.append("type", type);

        try {

            const res = await axiosPrivate.post(`/cereri/${id}/modify`,
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

    const handleDeleteCerereTip = async (id_cerere) => {
        navigate('/cereri');
        try {
            await axiosPrivate.post(`cereri/${id}/delete`, {
                id_cerere
            });
            console.log("Cerere tip stearsa");
        } catch (err) {
            console.error("Eroare completă:", err);
            console.error("Răspuns server:", err.response?.data);
        }
    }

    return (
        <div className="student-page">
            <ToastContainer />
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
                                {
                                    showDropDown ? (
                                        <div>
                                            <form onSubmit={() => handleModificaCerere()} style={{ marginBottom: "20px" }}>
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
                                                <button type="submit"> Salveaza modificari </button>
                                                <button onClick={() => setShowDropDown((prev) => !prev)}>Anuleaza</button>
                                            </form>
                                        </div>
                                    ) : (
                                        <>
                                            <p>Detalii cerere</p>
                                            <p>Nume: {cerereTip.title}</p>
                                            <p>Tip: {cerereTip.type}</p>
                                            <button onClick={() => handleDownload(cerereTip.id_cerere)}>
                                                Descarcă
                                            </button>

                                            <button onClick={() => {
                                                setShowDropDown((prev) => !prev)
                                                setTitle(cerereTip.title)
                                                setType(cerereTip.type)
                                            }
                                            }
                                            >Modifica cerere</button>

                                            <button
                                                onClick={() => handleDeleteCerereTip(cerereTip.id_cerere)}
                                            >Sterge</button>
                                        </>
                                    )}
                            </>
                        ) : (
                            <p>Nu exista detalii pentru aceasta cerere.</p>
                        )
                        }
                    </div>
                )
                }
            </main >
        </div >
    );
}

export default CerereTip;
