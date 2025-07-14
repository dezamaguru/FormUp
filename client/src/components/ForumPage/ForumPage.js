import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../SideBar/SideBar";
import './ForumPage.css';
import useAuth from "../../hooks/useAuth";
import AdaugaConversatie from "./AdaugaConversatie";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useFirebaseNotifications from "../../hooks/useFirebaseNotifications";
import Header from "../Header/Header";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

const ForumPage = () => {
    useFirebaseNotifications();
    const axiosPrivate = useAxiosPrivate();
    const [conversatii, setConversatii] = useState([]);
    const [selectedConv, setSelectedConv] = useState(0);
    const [newMessage, setNewMessage] = useState("");
    const { auth } = useAuth();
    const [mesage, setMesaje] = useState([]);
    const [titluConversatie, setTitluConversatie] = useState("");

    // Functie pentru refresh conversatii
    const getConversatii = async () => {
        try {
            const res = await axiosPrivate.get("/inbox");
            setConversatii(res.data);
        } catch (err) {
            if (err.name !== "CanceledError") {
                console.error(err.response?.data);
            }
        }
    };

    useEffect(() => {
        getConversatii();
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
                        className={`friends ${selectedConv === conversatie.id_conversatie ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedConv(conversatie.id_conversatie);
                            setTitluConversatie(conversatie.title);
                        }}
                    >
                        <div className="friends-credent">
                            <span className="friends-name">{conversatie.title}</span>

                            <span className="friends-message">
                                Inițiator: <strong>{conversatie.User?.firstName} {conversatie.User?.lastName}</strong>
                            </span>
                            <span className="friends-message">
                                Destinatar: <strong>
                                    {auth.type === "student"
                                        ? `${conversatie.secretar?.firstName} ${conversatie.secretar?.lastName}`
                                        : `${conversatie.student?.firstName} ${conversatie.student?.lastName}`}
                                </strong>
                            </span>

                            <span className="friends-message">{conversatie.User?.facultate}</span>
                            <span className="friends-message">An studiu:{conversatie.User?.an_studiu}</span>
                        </div>
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
                <AdaugaConversatie onConversatieAdaugata={getConversatii} />
            ) : mesage.length > 0 ? (
                mesage.map((mesaj, index) => {
                    const isOwn = mesaj.type === auth.type;
                    const bubbleClass = isOwn ? "your-chat-balloon" : "friends-chat-balloon";
                    const wrapperClass = isOwn ? "your-chat" : "friends-chat";

                    return (
                        <div className={wrapperClass} key={index}>
                            <div className={bubbleClass}>
                                <div>{mesaj.continut}</div>
                                <div className="msg-footer">
                                    {format(new Date(mesaj.createdAt), "dd MMM yyyy, HH:mm", { locale: ro })}
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>Nu exista mesaje</p>
            )}
        </div>
    );

    return (
        <div className="student-page">
            <ToastContainer />
            <SideBar />

            <main className="main-content">
                <Header />

                <div className="app">
                    <section className="main-left">
                        <div className="header-left">
                            <AdaugaConversatie onConversatieAdaugata={getConversatii} />
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
