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
        getSolicitare();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate, navigate, location]);

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
                        <section className="ccard-solicitare">
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

                        {/* Solicitari */}
                        <section className="card-cereri-observatie" style={{ gridArea: "observatie" }}>
                            <strong>Observatii</strong>
                            <div className='observatie-card'>
                                <p>yay card</p>
                            </div>
                        </section>
                    </div>
                )}

            </main>
        </div>
    )
}

export default SolicitareCerere;