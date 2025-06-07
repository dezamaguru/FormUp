import './Dashboard.css';
import SideBar from '../SideBar/SideBar';
import { ToastContainer } from 'react-toastify';
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import StatisiciGenerale from './GeneralStats/StatisticiGenerale';
import StatisticiStatus from './StatusStats/StatisticiStatus';
import TimpMediuProcesare from './TimpProcesareStats/TimpProcesareStats';
import StatisticiAnProgram from './DistributieStats/StatisticiAnProgram';
import StatisticiEvolutieCereri from './EvolutieInTimp/StatisticiEvolutieCereri';
import { useState } from 'react';

function Dashboard() {
    useFirebaseNotifications();
    const [activeTab, setActiveTab] = useState("generale");

    const renderActiveTab = () => {
        switch (activeTab) {
            case "generale": return <StatisiciGenerale />;
            case "status": return <StatisticiStatus />;
            case "procesare": return <TimpMediuProcesare />;
            case "distributie": return <StatisticiAnProgram />;
            case "evolutie": return <StatisticiEvolutieCereri />;
            default: return null;
        }
    };

    return (
        <div className="student-page">
            <ToastContainer />
            <SideBar />

            <main className="main-content">
                <header className="header">
                    <h1>Welcome!</h1>
                    <div className="header-buttons">
                        <button className="icon-button" aria-label="Notifications">🔔</button>
                        <button className="icon-button avatar-button" aria-label="Profile">👤</button>
                    </div>
                </header>

                {/* Navigație locală în pagină */}
                <div className="stat-nav">
                    <div className="stat-nav">
                        <button
                            className={activeTab === "generale" ? "active" : ""}
                            onClick={() => setActiveTab("generale")}
                        >
                            Statistici Generale
                        </button>
                        <button
                            className={activeTab === "status" ? "active" : ""}
                            onClick={() => setActiveTab("status")}
                        >
                            Distribuție Status
                        </button>
                        <button
                            className={activeTab === "procesare" ? "active" : ""}
                            onClick={() => setActiveTab("procesare")}
                        >
                            Timp Procesare
                        </button>
                        <button
                            className={activeTab === "distributie" ? "active" : ""}
                            onClick={() => setActiveTab("distributie")}
                        >
                            An / Program
                        </button>
                        <button
                            className={activeTab === "evolutie" ? "active" : ""}
                            onClick={() => setActiveTab("evolutie")}
                        >
                            Evoluție în timp
                        </button>
                    </div>

                </div>

                {/* Afișează componenta activă */}
                <section>
                    {renderActiveTab()}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
