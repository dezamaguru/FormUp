import './SecretarPage.css';
import SideBar from "../SideBar/SideBar";

function SecretarRole() {

    return (
        <div className="student-page">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="header">
          <h1>Welcome!</h1>
          <div className="header-buttons">
            <button className="icon-button" aria-label="Notifications">🔔</button>
            <button className="icon-button avatar-button" aria-label="Profile">👤</button>
          </div>
        </header>

        {/* Dashboard sections */}
        <div className="dashboard">
          {/* Classes */}
          <section className="card classes" style={{ gridArea: "classes" }}>
            <h3>Classes for the day</h3>
            <div className="class-card">
              <strong>Mathematics</strong>
              <p>Professor Joe</p>
              <small>5/2/22</small>
            </div>
            <div className="class-card">
              <strong>Physics</strong>
              <p>Professor John</p>
              <small>5/2/22</small>
            </div>
            <div className="class-card">
              <strong>Chemistry</strong>
              <p>Professor Matt</p>
              <small>5/2/22</small>
            </div>
          </section>

          {/* News */}
          <section className="card news" style={{ gridArea: "news" }}>
            <h3>News & Updates</h3>
            <div className="news-box">
              <p>Universities to announce exams</p>
              <button className="read-more">Read more</button>
            </div>
          </section>
        </div>
      </main>
    </div>
    );
}

export default SecretarRole;