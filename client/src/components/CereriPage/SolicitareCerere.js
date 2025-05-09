import './SolicitareCerere.css';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function SolicitareCerere() {
    const [solicitare, setSolicitare] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const { id } = useParams();
    const [statusSolicitare, setStatusAdeverinta] = useState("");

    const [title, setTitle] = useState("");
    const [continut, setContinut] = useState("");

    const [titleModificat, setTitleModificat] = useState("");
    const [continutModificat, setContinutModificat] = useState("");

    const [observatii, setObservatii] = useState([]);

    const [selectedObservatieId, setSelectedObservatieId] = useState(null);

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
                    //navigate("/", { state: { from: location }, replace: true });
                }
            }
        };

        const getObservatii = async () => {
            try {
                const res = await axiosPrivate.get(`/cereri/solicitari/${id}/observatii`,
                    { signal: controller.signal })

                if (isMounted) {
                    //console.log("Solicitari primite:", res.data);
                    setObservatii(res.data);
                }
            } catch (err) {
                if (err.name === "CanceledError") {
                    console.log("Request canceled:", err.message);
                } else {
                    console.error(err.res.data);
                    //navigate("/", { state: { from: location }, replace: true });
                }
            }
        }

        getSolicitare();
        getObservatii();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);


    const handleUpload = async (e) => {
        e.preventDefault();

        if (!title || !continut) {
            return alert("Formularul trebuie completat integral.");
        }

        try {
            const res = await axiosPrivate.post(`/cereri/solicitari/${id}/upload`, {
                title,
                continut
            });

            setObservatii((prev) => [...prev, res.data.observatie]);
            setTitle("");
            setContinut("");
        } catch (err) {
            console.error("Eroare completă:", err);
            console.error("Răspuns server:", err.response?.data);
            alert(err.response?.data?.message || "Eroare la upload");
        }
    }

    const handleStatusChange = async (id) => {

        try {

            const res = await axiosPrivate.post(`/cereri/solicitari/${id}/status`, {
                statusSolicitare
            });
            setStatusAdeverinta("");
            console.log("Status-ul solicitarii a fost actualzizat: ", res.data);
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

            setTitle("");
            setContinut("");
            console.log("Obsservatia a fost modificata cu succes!", res.data);
        } catch (err) {
            console.log("Eroare la modificarea obseravtiei", err);
        }
    }

    const handleDeleteObservatie = async(id_observatie) => {
        try{
            const res = await axiosPrivate.post(`/cereri/solicitari/${id}/delete`, {
                id_observatie: id_observatie
            })
            console.log("Observatie stearsa", res.data);
        } catch(err) {
            console.log("Eroare la stergere obseravtie");
        }
    }

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
                    <div className="dashboard-solicitare" style={{ gridArea: "solicitare" }}>
                        <section className="card-solicitare">
                            {solicitare ? (
                                <div className="solicitare-card">
                                    <p>Detalii solicitare</p>
                                    <strong>ID Solicitare: {solicitare.id_solicitare}</strong>
                                    <p>ID Cerere: {solicitare.id_cerere}</p>
                                    <p>ID Utilizator: {solicitare.userId}</p>
                                    <p>Status: {solicitare.status}</p>
                                </div>
                            ) : (
                                <p>Nu exista detalii pentru acesta solicitare</p>
                            )}
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
                        <section className="ccard-solicitare">
                            {solicitare ? (
                                <div className="solicitare-card">
                                    <p>Detalii solicitare</p>
                                    <strong>ID Solicitare: {solicitare.id_solicitare}</strong>
                                    <p>ID Cerere: {solicitare.id_cerere}</p>
                                    <p>ID Utilizator: {solicitare.userId}</p>
                                    <p>Status: {solicitare.status}</p>
                                    <form onSubmit={() => handleStatusChange(solicitare.id_solicitare)}>
                                        <select
                                            value={statusSolicitare}
                                            onChange={(e) => setStatusAdeverinta(e.target.value)}
                                        >
                                            <option value="" disabled hidden>Schimba status</option>
                                            <option value="Procesare">Procesare</option>
                                            <option value="Aprobata">Aprobata</option>
                                            <option value="Respinsa">Respinsa</option>
                                        </select>
                                        <button type='submit'>Update status</button>
                                    </form>
                                </div>
                            ) : (
                                <p>Nu exista detalii pentru acesta solicitare</p>
                            )}
                        </section>

                        {/* Observatii */}
                        <section className="card-cereri-observatie" style={{ gridArea: "observatie" }}>
                            <strong>Observatii</strong>
                            <div className='container-form-observatii'>
                                <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
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

                                    <button type='submit'>Submit</button>
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

                                                        <button type='submit' >Salveaza</button>
                                                        <button
                                                            onClick={() => setSelectedObservatieId(null)}>Anuleaza</button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <>
                                                    <strong>{observatie.titlu}</strong>
                                                    <p>{observatie.continut}</p>
                                                    <button onClick={() => {
                                                        setSelectedObservatieId(observatie.id_observatie);
                                                        setTitleModificat(observatie.titlu);
                                                        setContinutModificat(observatie.continut);
                                                    }}>Modifica</button>
                                                    <button
                                                    onClick={()=> handleDeleteObservatie(observatie.id_observatie)}
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