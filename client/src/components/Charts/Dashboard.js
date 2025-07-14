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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from '../Header/Header';

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

    const exportAllStatsToPdf = async () => {
        const section = document.getElementById("pdf-all-stats");
        if (!section) return;

        const canvas = await html2canvas(section, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        let position = 0;
        if (height <= pdf.internal.pageSize.getHeight()) {
            pdf.addImage(imgData, "PNG", 10, 10, width - 20, height);
        } else {
            while (position < height) {
                pdf.addImage(imgData, "PNG", 0, -position, width, height);
                position += pdf.internal.pageSize.getHeight();
                if (position < height) pdf.addPage();
            }
        }

        pdf.save("statistici_complete.pdf");
    };

    return (
        <div className="student-page">
            <ToastContainer />
            <SideBar />

            <main className="main-content">
                <Header/>

                <div className="stat-nav">
                    <button className={activeTab === "generale" ? "active" : ""} onClick={() => setActiveTab("generale")}>
                        Statistici Generale
                    </button>
                    <button className={activeTab === "status" ? "active" : ""} onClick={() => setActiveTab("status")}>
                        Distribuție Status
                    </button>
                    <button className={activeTab === "procesare" ? "active" : ""} onClick={() => setActiveTab("procesare")}>
                        Timp Procesare
                    </button>
                    <button className={activeTab === "distributie" ? "active" : ""} onClick={() => setActiveTab("distributie")}>
                        An / Program
                    </button>
                    <button className={activeTab === "evolutie" ? "active" : ""} onClick={() => setActiveTab("evolutie")}>
                        Evoluție în timp
                    </button>
                    <button
                        className="pdf-button"
                        onClick={exportAllStatsToPdf}
                        style={{ marginLeft: "1rem", backgroundColor: "#4ade80", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 1rem", cursor: "pointer" }}
                    >
                        Exportă PDF
                    </button>
                </div>

                <section>
                    {renderActiveTab()}
                </section>

                <div id="pdf-all-stats" style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
                    <StatisiciGenerale />
                    <StatisticiStatus />
                    <TimpMediuProcesare />
                    <StatisticiAnProgram />
                    <StatisticiEvolutieCereri />
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
