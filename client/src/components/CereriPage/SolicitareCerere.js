import './SolicitareCerere.css';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../SideBar/SideBar";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ToastContainer, toast } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import Header from '../Header/Header';

function SolicitareCerere() {
    useFirebaseNotifications();
    const [solicitare, setSolicitare] = useState();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { id } = useParams();
    const [statusSolicitare, setStatusAdeverinta] = useState("");
    const [title, setTitle] = useState("");
    const [continut, setContinut] = useState("");
    const [titleModificat, setTitleModificat] = useState("");
    const [continutModificat, setContinutModificat] = useState("");
    const [observatii, setObservatii] = useState([]);
    const [selectedObservatieId, setSelectedObservatieId] = useState(null);
    const [files, setFiles] = useState([]);
    const [documente, setDocumente] = useState([]);
    const [cerere, setCerere] = useState("");

    const getObservatii = async (signal) => {
        try {
            const res = await axiosPrivate.get(`/cereri/solicitari/${id}/observatii`,
                signal ? { signal } : undefined)
            setObservatii(res.data);
        } catch (err) {
            if (err.name === "CanceledError") {
                console.log("Request canceled:", err.message);
            } else {
                console.error(err.res?.data);
            }
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getSolicitare = async () => {
            try {
                const response = await axiosPrivate.get(`/cereri/solicitari/${id}`, {
                    signal: controller.signal,
                });
                if (isMounted) {
                    setSolicitare(response.data);
                }
            } catch (error) {
                if (error.name === "CanceledError") {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error(error.response.data);
                }
            }
        };

        getSolicitare();
        getObservatii(controller.signal);
        getDocumente(controller.signal);

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);

    const getDocumente = async (signal) => {
        try {
            const res = await axiosPrivate.get(`/cereri/solicitari/${id}/documente`,
                signal ? { signal } : undefined)
            setDocumente(res.data);
        } catch (err) {
            if (err.name === "CanceledError") {
                console.log("Request canceled:", err.message);
            } else {
                console.error(err.res?.data);
            }
        }
    }

    const handleUploadObservatie = async (e) => {
        e.preventDefault();

        if (!title || !continut) {
            return alert("Formularul trebuie completat integral.");
        }

        try {
            const res = await axiosPrivate.post(`/cereri/solicitari/${id}/upload`, {
                title,
                continut
            });

            var data = {
                title: "Notificare onservatie",
                body: "Observatie primita"
            };

            toast.success(
                <div>
                    <div>
                        Observatie trimisa cu succes!
                    </div>
                </div>,
                { position: 'top-right' }
            )
            setObservatii((prev) => [...prev, res.data.observatie]);
            setTitle("");
            setContinut("");
        } catch (err) {
            console.error("Eroare completă:", err);
            console.error("Răspuns server:", err.response?.data);
            alert(err.response?.data?.message || "Eroare la upload");
        }
    }

    const handleStatusChange = async (e, id) => {
        e.preventDefault();
        try {
            const res = await axiosPrivate.post(`/cereri/solicitari/${id}/status`, {
                statusSolicitare
            });
            setStatusAdeverinta("");
            console.log("Status-ul solicitarii a fost actualzizat: ", res.data);

            toast.success(
                <div>
                    <div>
                        Statusul solicitării a fost actualizat cu succes!
                    </div>
                </div>,
                { position: 'top-right' }
            )
        } catch (err) {
            console.log("Eroare la actualizarea statusului solicitarii: ", err);
        }
    }

    const handleModificaObservatie = async (id_observatie) => {

        try {
            const res = await axiosPrivate.post(`/cereri/solicitari/${id}/modify`, {
                titleModificat,
                continutModificat,
                id_observatie: id_observatie
            });

            toast.success(
                <div>
                    <div>
                        Observatie modificata cu succes!
                    </div>
                </div>,
                { position: 'top-right' }
            )

            setTitle("");
            setContinut("");
            console.log("Obsservatia a fost modificata cu succes!", res.data);
        } catch (err) {
            console.log("Eroare la modificarea obseravtiei", err);
        }
    }

    const handleDeleteObservatie = async (id_observatie) => {
        try {
            const res = await axiosPrivate.post(`/cereri/solicitari/${id}/delete`, {
                id_observatie: id_observatie
            })
            // Reîncarcă lista de observații după ștergere
            await getObservatii();
            console.log("Observatie stearsa", res.data);
        } catch (err) {
            console.log("Eroare la stergere obseravtie");
        }
    }

    const handleUploadDocumente = async () => {
        if (files.length === 0)
            return alert("Niciun fișier selectat.");

        const formData = new FormData();
        files.forEach(file => formData.append("files", file));

        if (auth?.type === 'secretar' && solicitare?.User?.userId) {
            formData.append("destinatar", solicitare.User.userId);
        }

        try {
            await axiosPrivate.post(`/cereri/solicitari/${id}/uploadDocumente`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Documentele au fost incarate!", {
                position: "top-right"
            });

            setFiles([]);
            await getDocumente();
        } catch (err) {
            console.error("Eroare încărcare fișiere:", err);
            toast.error("Eroare la încărcarea fișierelor.");
        }
    }

    const handleDeleteDocument = async (id_document) => {

        try {
            await axiosPrivate.post(`/cereri/solicitari/${id}/documente/delete`, {
                id_document: id_document
            });

            toast.success(
                <div>
                    <div>
                        Document sters!
                    </div>
                </div>,
                { position: 'top-right' }
            )
            getDocumente();

        } catch (err) {
            console.error("Eroare la ștergerea documentului:", err);
            toast.error("Eroare la ștergere.");
        }

    }

    const handleDownloadDocument = async (id_document, file_name) => {
        try {
            const res = await axiosPrivate.get(
                `/cereri/solicitari/${id}/documente/download?id_document=${id_document}`,
                { responseType: "blob" }
            );

            if (!res.data) {
                throw new Error("Nu s-au primit date de la server");
            }

            let filename = "document.pdf";
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
            a.download = file_name;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Eroare la descarcarea documentului: ", err);
            toast.error("Eroare la ștergere.");
        }
    }

    return (
        <div className="student-page">
            <ToastContainer />
            <SideBar />

            {/* Main Content */}
            <main className="main-content-solicitare">
                <Header />
                {auth?.type === "student" && (
                    <div className="dashboard-solicitare" style={{ gridArea: "solicitare" }}>
                        <section className="card-solicitare">
                            <section className='detalii-container' style={{ gridArea: "detalii" }}>
                                {solicitare ? (
                                    <div className="solicitare-card">
                                        <strong>Solicitare pentru {solicitare?.Cereri?.title}</strong>
                                        <p>
                                            Status:{" "}
                                            <span className={`status-solicitare ${solicitare.status.toLowerCase()}`}>
                                                {solicitare.status}
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <p>Nu exista detalii pentru acesta solicitare</p>
                                )}

                                <div
                                    className="dropzone"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const droppedFiles = Array.from(e.dataTransfer.files);
                                        setFiles((prev) => [...prev, ...droppedFiles]);
                                    }}
                                >
                                    <p>Trage fișiere aici sau folosește butonul de mai jos</p>
                                </div>

                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files)])}
                                />

                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>

                                <button className="upload-btn" onClick={handleUploadDocumente}>
                                    Încarcă documente
                                </button>
                            </section>

                            <section className='documente-container' style={{ gridArea: "documente" }}>
                                <strong>Documente incarcate</strong>
                                {Array.isArray(documente) && documente.filter(doc => doc.uploadedBy === solicitare?.User?.userId).length > 0 ? (
                                    documente
                                        .filter(doc => doc.uploadedBy === solicitare?.User?.userId)
                                        .map((doc) => (
                                            <div key={doc.id_document} className='document-card'>
                                                <p>{doc.file_name}</p>
                                                <button className="delete-btn"
                                                    onClick={() => handleDeleteDocument(doc.id_document)}>
                                                    Șterge
                                                </button>
                                                <button className="download-btn"
                                                    onClick={() => handleDownloadDocument(doc.id_document, doc.file_name)}>
                                                    Descarcă
                                                </button>
                                            </div>
                                        ))
                                ) : (
                                    <p>Nu există documente încărcate de tine pentru această solicitare</p>
                                )}
                            </section>

                            <section className='documente-container' style={{ gridArea: "documente2" }}>
                                <strong>Documente primite de la secretariat</strong>
                                {documente.filter(doc => doc.destinatar === solicitare?.User?.userId).length > 0 ? (
                                    documente
                                        .filter(doc => doc.destinatar === solicitare?.User?.userId)
                                        .map((doc) => (
                                            <div key={doc.id_document} className='document-card'>
                                                <p>{doc.file_name}</p>
                                                <button className="download-btn"
                                                    onClick={() => handleDownloadDocument(doc.id_document, doc.file_name)}
                                                >Descarcă</button>
                                            </div>
                                        ))
                                ) : (
                                    <p>Nu există documente primite de la secretariat</p>
                                )}
                            </section>

                        </section>

                        {/* Observatii */}
                        <section className="card-cereri-observatie" style={{ gridArea: "observatie" }}>
                            <strong>Observatii</strong>
                            <div>
                                {Array.isArray(observatii) && observatii.length > 0 ? (
                                    observatii.map((observatie) => (
                                        <div
                                            key={observatie.id_observatie}
                                            className='observatie-card'>

                                            <strong>{observatie.titlu}</strong>
                                            <p>{observatie.continut}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nu exista observatii</p>
                                )}
                            </div>
                        </section>
                    </div>
                )}

                {auth?.type === 'secretar' && (
                    <div className="dashboard-solicitare" style={{ gridArea: "solicitare" }}>
                        <section className="card-solicitare">
                            <section className='detalii-container' style={{ gridArea: "detalii" }}>
                                {solicitare ? (
                                    <div className="solicitare-card">

                                        <strong>Solicitare pentru {solicitare?.Cereri?.title}</strong>
                                        <p>Student: {solicitare?.User?.firstName} {solicitare?.User?.lastName}</p>

                                        <p>
                                            Status:{" "}
                                            <span className={`status-solicitare ${solicitare.status.toLowerCase()}`}>
                                                {solicitare.status}
                                            </span>
                                        </p>

                                        <form onSubmit={(e) => handleStatusChange(e, solicitare.id_solicitare)}>
                                            <select
                                                value={statusSolicitare}
                                                onChange={(e) => setStatusAdeverinta(e.target.value)}
                                            >
                                                <option value="" disabled hidden>Schimba status</option>
                                                <option value="Procesare">Procesare</option>
                                                <option value="Aprobata">Aprobata</option>
                                                <option value="Respinsa">Respinsa</option>
                                            </select>
                                            <button
                                                className='download-btn'
                                                type='submit'>Update status</button>
                                        </form>
                                    </div>
                                ) : (
                                    <p>Nu exista detalii pentru acesta solicitare</p>
                                )}

                                {/* <div
                                    className="dropzone"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const droppedFiles = Array.from(e.dataTransfer.files);
                                        setFiles((prev) => [...prev, ...droppedFiles]);
                                    }}
                                >
                                    <p>Trage fișiere aici sau folosește butonul de mai jos</p>
                                </div> */}

                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files)])}
                                />

                                <ul>
                                    {files.map((file, index) => (
                                        <li key={index}>{file.name}</li>
                                    ))}
                                </ul>

                                <button className="upload-btn" onClick={handleUploadDocumente}>
                                    Încarcă documente
                                </button>
                            </section>

                            <section className='documente-container' style={{ gridArea: "documente" }}>
                                <strong>Documente trimise de student</strong>
                                {documente.filter(doc => doc.uploadedBy === solicitare?.User?.userId).length > 0 ? (
                                    documente
                                        .filter(doc => doc.uploadedBy === solicitare?.User?.userId)
                                        .map((doc) => (
                                            <div key={doc.id_document} className='document-card'>
                                                <p>{doc.file_name}</p>
                                                <button className="download-btn"
                                                    onClick={() => handleDownloadDocument(doc.id_document, doc.file_name)}
                                                >Descarcă</button>
                                            </div>
                                        ))
                                ) : (
                                    <p>Nu există documente primite de la secretariat</p>
                                )}
                            </section>

                            <section className='documente-container' style={{ gridArea: "documente2" }}>
                                <strong>Documente incarcate</strong>
                                {documente.filter(doc => doc.destinatar === solicitare?.User?.userId).length > 0 ? (
                                    documente
                                        .filter(doc => doc.destinatar === solicitare?.User?.userId)
                                        .map((doc) => (
                                            <div key={doc.id_document} className='document-card'>
                                                <p>{doc.file_name}</p>
                                                <button className="delete-btn"
                                                    onClick={() => handleDeleteDocument(doc.id_document)}>
                                                    Șterge
                                                </button>
                                                <button className="download-btn"
                                                    onClick={() => handleDownloadDocument(doc.id_document, doc.file_name)}
                                                >Descarcă</button>
                                            </div>
                                        ))
                                ) : (
                                    <p>Nu există documente primite de la secretariat</p>
                                )}
                            </section>

                        </section>

                        {/* Observatii */}
                        <section className="card-cereri-observatie" style={{ gridArea: "observatie" }}>
                            <strong>Observatii</strong>
                            <div className='container-form-observatii'>
                                <form onSubmit={handleUploadObservatie} style={{ marginBottom: "20px" }}>
                                    <input
                                        type='text'
                                        placeholder='Titlu observatie'
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />

                                    <input
                                        type='text'
                                        placeholder='Continut text...'
                                        value={continut}
                                        onChange={(e) => setContinut(e.target.value)}
                                    />

                                    <button className='download-btn'
                                        type='submit'>Submit</button>
                                </form>
                            </div>

                            <div>
                                {Array.isArray(observatii) && observatii.length > 0 ? (
                                    observatii.map((observatie) => (
                                        <div
                                            key={observatie.id_observatie}
                                            className='observatie-card'>
                                            {selectedObservatieId === observatie.id_observatie ? (
                                                <div>
                                                    <form onSubmit={() => handleModificaObservatie(observatie.id_observatie)} style={{ marginBottom: "20px" }}>
                                                        <input
                                                            type='text'
                                                            placeholder='Titlu observatie'
                                                            value={titleModificat}
                                                            onChange={(e) => setTitleModificat(e.target.value)}
                                                            required
                                                        />

                                                        <input
                                                            type='text'
                                                            placeholder='Continut text...'
                                                            value={continutModificat}
                                                            onChange={(e) => setContinutModificat(e.target.value)}
                                                        />

                                                        <button
                                                            className='download-btn'
                                                            type='submit' >Salveaza</button>
                                                        <button
                                                            className='delete-btn'
                                                            onClick={() => setSelectedObservatieId(null)}>Anuleaza</button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <>
                                                    <strong>{observatie.titlu}</strong>
                                                    <p>{observatie.continut}</p>
                                                    <button
                                                        className='download-btn'
                                                        onClick={() => {
                                                            setSelectedObservatieId(observatie.id_observatie);
                                                            setTitleModificat(observatie.titlu);
                                                            setContinutModificat(observatie.continut);
                                                        }}>Modifica</button>
                                                    <button
                                                        className='delete-btn'
                                                        onClick={() => handleDeleteObservatie(observatie.id_observatie)}
                                                    >Sterge</button>
                                                </>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>Nu exista observatii</p>
                                )}
                            </div>
                        </section>
                    </div>
                )}

            </main>
        </div>
    )
}

export default SolicitareCerere;