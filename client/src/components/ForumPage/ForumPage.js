import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../SideBar/SideBar";
import './ForumPage.css';
import useAuth from "../../hooks/useAuth";
import AdaugaConversatie from "./AdaugaConversatie";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";

const ForumPage = () => {
    useFirebaseNotifications();
    const axiosPrivate = useAxiosPrivate();
    const [conversatii, setConversatii] = useState([]);
    const [selectedConv, setSelectedConv] = useState(0);
    const [newMessage, setNewMessage] = useState("");
    const { auth } = useAuth();
    const [mesage, setMesaje] = useState([]);
    const [titluConversatie, setTitluConversatie] = useState("");

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getConversatii = async () => {
            try {
                const res = await axiosPrivate.get("/inbox", {
                    signal: controller.signal,
                });
                if (isMounted) {
                    setConversatii(res.data);
                }
            } catch (err) {
                if (err.name !== "CanceledError") {
                    console.error(err.response?.data);
                }
            }
        };

        getConversatii();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);

    const getMesaje = async () => {
        try {
            const res = await axiosPrivate.get(`/inbox/mesaje/${selectedConv}`);
            setMesaje(res.data);
        } catch (err) {
            console.error("Eroare la deschiderea conversației:", err);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        if (!selectedConv) {
            alert("Selectează o conversație!");
            return;
        }
        try {
            await axiosPrivate.post(`/inbox/send`, {
                newMessage,
                selectedConv,
            });

            toast.success(
                <div>
                    <div>
                        Mesaj trimis
                    </div>
                </div>,
                { position: 'top-right' }
            )

            getMesaje();
            setNewMessage("");
        } catch (err) {
            console.error("Eroare la trimiterea mesajului:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        if (selectedConv) getMesaje();
    }, [selectedConv]);

    const renderConversations = () => (
        <div className="chat-list">
            {Array.isArray(conversatii) && conversatii.length > 0 ? (
                conversatii.map((conversatie) => (
                    <div
                        key={conversatie.id_conversatie}
                        className="friends"
                        onClick={() => {
                            setSelectedConv(conversatie.id_conversatie);
                            setTitluConversatie(conversatie.title);
                        }}
                    >
                        <div className="friends-credent">
                            <span className="friends-name">{conversatie.title}</span>
                            <span className="friends-message">Id: {conversatie.id_conversatie}</span>
                            <span className="friends-message">UserId: {conversatie.userId}</span>
                        </div>
                        <span className="badge notif-badge">7</span>
                    </div>
                ))
            ) : (
                <p>Nu exista conversatii</p>
            )}
        </div>
    );

    const renderChat = () => (
        <div className="chat-area">
            {selectedConv === 0 ? (
                <AdaugaConversatie />
            ) : (
                mesage.length > 0 ? (
                    mesage.map((mesaj, index) => (
                        mesaj.type === auth.type ? (
                            <div className="your-chat" key={index}>
                                <p className="your-chat-balloon">{mesaj.continut}</p>
                            </div>
                        ) : (
                            <div className="friends-chat" key={index}>
                                <p className="friends-chat-balloon">{mesaj.continut}</p>
                            </div>
                        )
                    ))
                ) : (
                    <p>Nu exista mesaje</p>
                )
            )}
        </div>
    );

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

                <div className="app">
                    <section className="main-left">
                        <div className="header-left">
                            <AdaugaConversatie />
                        </div>
                        {renderConversations()}
                    </section>

                    <section className="main-right">
                        <div className="header-right">
                            <p className="name friend-dane">{titluConversatie}</p>
                        </div>

                        <div className="some-btn">
                            <span className="glyphicon glyphicon-facetime-video" />
                            <span className="glyphicon glyphicon-earphone" />
                            <span className="glyphicon glyphicon-option-vertical option-btn" />
                        </div>

                        {renderChat()}

                        <div className="typing-area">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="type-area"
                                placeholder="Scrie un mesaj..."
                            />

                            <div className="attach-btn">
                                <span className="glyphicon glyphicon-paperclip file-btn"></span>
                                <span className="glyphicon glyphicon-camera"></span>
                                <span className="glyphicon glyphicon-picture"></span>
                            </div>

                            <button type="button" onClick={handleSendMessage}>Trimite</button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ForumPage;
