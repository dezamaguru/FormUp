import SideBar from "../SideBar/SideBar";
import useAuth from "../../hooks/useAuth";

function ForumPage() {
    const { auth } = useAuth();

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
            </main>

            {auth?.type === "student" && (
                <div className="dashboard-inbox" style={{ gridArea: "solicitare" }}>
                    <p>student</p>
                </div>
            )}

            {auth?.type === "secretar" && (
                <div>
                    <p>Secretar</p>
                </div>
            )}

        </div>
    )
}

export default ForumPage;