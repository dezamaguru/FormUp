import './StudentPage.css';
import SideBar from '../SideBar/SideBar';
import { useEffect, useState } from 'react';
import { generateToken, messaging, onMessageListener } from "../Notificari/firebase";
import { onMessage } from "firebase/messaging";
import { Toaster } from "react-hot-toast";
import { ToastContainer, toast } from 'react-toastify';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function StudentPage() {
  const axiosPrivate = useAxiosPrivate();
  const [fcmToken, setFcmToken] = useState("");
  const [title, setTile] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

        const fetchFcmToken = async () => {
          try{
              const token = await generateToken();
              setFcmToken(token);
              //console.log(token);
          } catch(err) {
            console.error("Error getting FCM token: ", err);
          }
        }

      useEffect(() => {
        fetchFcmToken();
        onMessage(messaging, (payload) =>{
            console.log(payload);
            //toast("Here is your toast");
        });
    }, [])

    onMessageListener().then(payload => {
      toast(
        <div>
          <strong>{payload?.notification?.title || "No title"}</strong>
          <br/>
          <strong>{payload?.notification?.body || "No body"}</strong>
        </div>,
        {position: "top-right"}
      );
      console.log("Receieved foreground message", payload);
    }).catch(err => console.error("error: ", err));

    const handlePushNotification = async() =>{
    // setTile("xfcgvhbjn");
    // setBody("cgvhbjn");
    // setFcmToken("xfcgvhbjn");
    setLoading(true);
    try{
      var data = {
        title: "Test",
        body: "notificare test",
        deviceToken: fcmToken
      };
      const response = await axiosPrivate.post('/firebase/send-notification', data);
      console.log(response);
      if(response.status === 200){
        toast.success(
          <div>
            <div>
              Notification sent
            </div>
          </div>,
          {position: 'top-right'}
        ) 
      } else{
          toast.error(
          <div>
            <div>
              Failed to send notification
            </div>
          </div>,
          {position: 'top-right'}
          )
        }
    } catch (err){
      console.error("Error at sending notification:", err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="student-page">
      <ToastContainer />
      {/* <div className='container firebase-form p-4'>
        <div className='row'>
        {
          fcmToken && (
            <div className='col-md-12 mb-4'> 
              <div className='alert alert-info'> 
                <strong> FCM Token: </strong> {fcmToken}
              </div>
            </div>
          )
        }
        </div>

      </div> */}
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}

      {/* <Toaster position="top-right absolute"/> */}

      <main className="main-content">
        {/* Top bar */}
        <header className="header">
          <h1>Welcome, Student!</h1>
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

          {/* Attendance */}
          {/* <section className="card attendance" style={{ gridArea: "attendance" }}>
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
          </section> */}

          {/* Calendar */}
          {/* <section className="card calendar" style={{ gridArea: "calendar" }}>
            <h3>My Calendar</h3>
            <p>March 2022</p>
            <div className="calendar-grid">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className={i === 14 ? 'active' : ''}>
                  {i + 1}
                </div>
              ))}
            </div>
          </section> */}

          {/* News */}
          <section className="card news" style={{ gridArea: "news" }}>
            <h3>News & Updates</h3>
            <div className="news-box">
              <p>Universities to announce exams</p>
              <button className="read-more" 
              onClick={handlePushNotification} 
              disabled = {loading}
              >{loading ? 'Sending' : 'Send'}</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default StudentPage;
