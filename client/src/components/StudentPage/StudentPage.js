import './StudentPage.css';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import  useAxiosPrivate  from '../../hooks/useAxiosPrivate';

function StudentPage() {

  const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const logout =  async() => {
        try {
            await axiosPrivate.get('/logout', {
                withCredentials: true,
            });
            console.log('Logout reușit');
            navigate('/', {state: { from: location }, replace: true});
        } catch (err) {
            console.error('Eroare la logout: ', err);
        }
    }

  return (
    <div className="student-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">FormUp</div>
        <nav className="nav-links">
          <p><Link to='/home'>Home</Link></p>
          <p><Link to='/cereri'>Cereri</Link></p>
          <p><Link to='/adeverinte'>Adeverinte</Link></p>
          <p><Link>Altceva</Link></p>
        </nav>
        <button className="sign-out" onClick={ () => logout() }>Sign Out</button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="header">
          <h1>Welcome, Student!</h1>
          <div className="header-buttons">
            <button className="icon-button" aria-label="Search">🔍</button>
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

          {/* Attendance */}
          <section className="card attendance" style={{ gridArea: "attendance" }}>
            <h3>Mark attendance</h3>
            <select>
              <option>Mathematics</option>
            </select>
            <input type="time" defaultValue="09:00" />
            <div className="pager">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n}>{n}</button>
              ))}
            </div>
            <button className="btn-primary">Present</button>
          </section>

          {/* Calendar */}
          <section className="card calendar" style={{ gridArea: "calendar" }}>
            <h3>My Calendar</h3>
            <p>March 2022</p>
            <div className="calendar-grid">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className={i === 14 ? 'active' : ''}>
                  {i + 1}
                </div>
              ))}
            </div>
          </section>

          {/* News */}
          <section className="card news" style={{ gridArea: "news" }}>
            <h3>News & Updates</h3>
            <div className="news-box">
              <img />
              <p>Universities to announce exams</p>
              <button className="read-more">Read more</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentPage;
