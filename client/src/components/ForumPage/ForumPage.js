import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../SideBar/SideBar";
import './ForumPage.css';
import useAuth from "../../hooks/useAuth";
import AdaugaConversatie from "./AdaugaConversatie";

const ForumPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const { auth } = useAuth();
    const [showDropDown, setShowDropDown] = useState(false);

    useEffect(() => {
        let isMounted = true;
    const controller = new AbortController();

        const getConversations = async () => {
            try {
                const res = await axiosPrivate.get("/inbox", {
                    signal: controller.signal,
                  });
                if(isMounted) {
                    setConversations(res.data);
                }
            } catch (err) {
                if (err.name === "CanceledError") {
                    console.log("Request canceled:", err.message);
                  } else {
                    console.error(err.response?.data);
                    navigate("/", { state: { from: location }, replace: true });
                  }
            }
        };

        getConversations();

        return () => {
            isMounted = false;
            controller.abort();
          };
    }, [axiosPrivate]);

    const handleSelect = async (id) => {
        // try {
        //     const res = await axiosPrivate.get(`/conversatii/${id}`);
        //     setSelectedConv(res.data);
        // } catch (err) {
        //     console.error("Eroare la deschiderea conversației:", err);
        // }
    };

    const handleSend = async () => {
        // if (!newMessage.trim()) return;
        // try {
        //     const res = await axiosPrivate.post(`/conversatii/${selectedConv.id}/mesaje`, {
        //         content: newMessage,
        //     });
        //     setSelectedConv((prev) => ({
        //         ...prev,
        //         mesaje: [...prev.mesaje, res.data],
        //     }));
        //     setNewMessage("");
        // } catch (err) {
        //     console.error("Eroare la trimiterea mesajului:", err);
        // }
    };

    return (
        <div className="student-page">
            <SideBar />

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

                {auth?.type === "student" && (
                    <div className="forum-layout">
                        {/* Lista conversații */}
                        <aside className="conversations-list card">
                            <button onClick={() => setShowDropDown((prev) => !prev)}>+ Conversatie</button>
                            <h3>Conversații</h3>
                            {Array.isArray(conversations) && conversations.length > 0 ? (
                                conversations.map((conversatie) => (
                                    <div key={conversatie.id_conversatie}
                                    className="">
                                        <strong>{conversatie.title}</strong>
                                    </div>
                                ))
                            ) : (
                                <p>Nu exita conversatii</p>
                            )
                        }
                            <ul>
                                {conversations.map((conv) => (
                                    <li key={conv.id} onClick={() => handleSelect(conv.id)}>
                                        {conv.titlu}
                                    </li>
                                ))}
                            </ul>
                        </aside>

                        {/* Fereastră conversație */}
                        <section className="conversation-window card">
                            {showDropDown ? (<AdaugaConversatie />) : (
                                <div>
                                    {selectedConv ? (
                                        <>
                                            <h3>{selectedConv.titlu}</h3>
                                            <div className="messages-box">
                                                {selectedConv.mesaje.map((msg, i) => (
                                                    <div key={i} className={`message ${msg.sender === "student" ? "student" : "secretar"}`}>
                                                        <p>{msg.content}</p>
                                                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="send-box">
                                                <input
                                                    type="text"
                                                    placeholder="Scrie un mesaj..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                />
                                                <button className="btn-primary" onClick={handleSend}>Trimite</button>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Selectează o conversație pentru a începe.</p>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ForumPage;