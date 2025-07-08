import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import "./Header.css";

function Header() {
    const axiosPrivate = useAxiosPrivate();
    const [user, setUser] = useState();
    const [notificari, setNotificari] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);


    const getUser = async () => {
        try {
            const user = await axiosPrivate.get('/users/getUser');
            setUser(user.data);
        } catch (err) {
            console.log("Eroare la preluare user: ", err);
        }
    };

    const getNotificari = async () => {
        try {
            const res = await axiosPrivate.get('/notificari');
            setNotificari(res.data);
        } catch (err) {
            console.error("Eroare la notificari:", err);
        }
    };

    const markAsRead = async (id_notificare) => {
        try {
            await axiosPrivate.post(`/notificari/mark-as-read/${id_notificare}`);
            getNotificari();
        } catch (err) {
            console.error("Eroare la marcare:", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadIds = notificari.filter(n => !n.citita).map(n => n.id_notificare);
            await Promise.all(unreadIds.map(id => axiosPrivate.post(`/notificari/mark-as-read/${id}`)));
            getNotificari();
        } catch (err) {
            console.error("Eroare la marcare toate:", err);
        }
    };
    
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setShowDropdown(false);
            setShowProfile(false);
        }
    };


    useEffect(() => {
        getUser();
        getNotificari();
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notificari.filter(n => !n.citita).length;

    return (
        <header className="header">
            <h1>Welcome, {user?.lastName} {user?.firstName}!</h1>
            <div className="header-buttons" ref={dropdownRef}>
                <div className="notif-icon-wrapper">
                    <button className="icon-button" onClick={() => setShowDropdown(prev => !prev)}>🔔</button>
                    {unreadCount > 0 && <span className="notif-badge-icon">{unreadCount}</span>}
                </div>

                {showDropdown && (
                    <div className="notif-dropdown">
                        <div className="notif-actions">
                            <button className="mark-all-btn" onClick={markAllAsRead}>✔️ Marchează toate ca citite</button>
                        </div>
                        {notificari.length > 0 ? (
                            notificari.map((n) => (
                                <div
                                    key={n.id_notificare}
                                    className={`notif-item ${!n.citita ? 'necitita' : ''}`}
                                    onClick={() => {
                                        markAsRead(n.id_notificare);
                                        navigate(n.link_destinatie);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <strong>{n.titlu}</strong>
                                    <p>{n.mesaj}</p>
                                    <small>{format(new Date(n.creat_la), "dd MMM yyyy, HH:mm", { locale: ro })}</small>
                                </div>
                            ))
                        ) : (
                            <p className="notif-empty">Nicio notificare</p>
                        )}
                    </div>
                )}

                <div className="profile-icon-wrapper">
                    <button className="icon-button avatar-button" onClick={() => setShowProfile(prev => !prev)}>👤</button>
                    {showProfile && (
                        <div className="profile-dropdown">
                            {user?.type === "student" ? (
                                <>
                                    <p><strong>{user.firstName} {user.lastName}</strong></p>
                                    <p>{user.email}</p>
                                    <hr />
                                    <p><strong>An:</strong> {user.an_studiu}</p>
                                    <p><strong>Facultate:</strong> {user.facultate}</p>
                                    <p><strong>Grupa:</strong> {user.grupa || '-'}</p>
                                    <p><strong>Învățământ:</strong> {user.forma_invatamant}</p>
                                    <p><strong>Finanțare:</strong> {user.forma_finantare}</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>{user.firstName} {user.lastName}</strong></p>
                                    <p>{user.email}</p>
                                    <hr />
                                    <p><strong>Reprezentant pentru:</strong> {user.program_studiu}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}

export default Header;
