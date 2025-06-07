import './Dashboard.css';
import SideBar from '../SideBar/SideBar';
import { ToastContainer } from 'react-toastify';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";

function Dashboard() {
    useFirebaseNotifications();
    const axiosPrivate = useAxiosPrivate();

    return (
        <div className="student-page">
            <ToastContainer />
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <main className="main-content">
                {/* Top bar */}
                <header className="header">
                    <h1>Welcome, Student!</h1>
                    <div className="header-buttons">
                        <button className="icon-button" aria-label="Notifications">🔔</button>
                        <button className="icon-button avatar-button" aria-label="Profile">👤</button>
                    </div>
                </header>

            </main>
        </div>
    );
}

export default Dashboard;