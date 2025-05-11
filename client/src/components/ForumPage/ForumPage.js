import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SideBar from "../SideBar/SideBar";
import './ForumPage.css';
import useAuth from "../../hooks/useAuth";
import AdaugaConversatie from "./AdaugaConversatie";

const ForumPage = () => {
    const axiosPrivate = useAxiosPrivate();
    const [conversatii, setConversatii] = useState([]);
    const [selectedConv, setSelectedConv] = useState(0);
    const [newMessage, setNewMessage] = useState("");
    const { auth } = useAuth();
    const [showDropDown, setShowDropDown] = useState(false);
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
                console.log("Conversatii: ", res.data);
            } catch (err) {
                if (err.name === "CanceledError") {
                    console.log("Request canceled:", err.message);
                } else {
                    console.error(err.response?.data);
                    //navigate("/", { state: { from: location }, replace: true });
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
            console.log("Mesage: ", res.data);
        } catch (err) {
            console.error("Eroare la deschiderea conversației:", err);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }
        if (!selectedConv) {
            alert("Selectează o conversație!");
            return;
        }
        try {
            const res = await axiosPrivate.post(`/inbox/send`, {
                newMessage,
                selectedConv,
            });

            getMesaje();
            setNewMessage(""); // Resetează câmpul de mesaj
            console.log("Mesaj trimis:", { newMessage, selectedConv });
        } catch (err) {
            console.error("Eroare la trimiterea mesajului:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        if (selectedConv) {
            getMesaje();
        }
    }, [selectedConv]);

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
                    <div className="app">

                        {/*LEFT SECTION*/}
                        <section className="main-left">

                            {/*HEADER */}
                            <div className="header-left">
                                {/* <span className="glyphicon glyphicon-menu-hamburger hamburger-btn"></span>
                                <span className="glyphicon glyphicon-search search-btn"></span>
                                <span className="glyphicon glyphicon-option-vertical option-btn"></span> */}
                                <AdaugaConversatie />
                            </div>

                            {/*CHAT LIST */}
                            <div className="chat-list">
                                <div className="friends">
                                    {Array.isArray(conversatii) && conversatii.length > 0 ?
                                        (
                                            conversatii.map((conversatie) => (
                                                <div onClick={() => setSelectedConv(conversatie.id_conversatie) &&
                                                    getMesaje()
                                                    && setTitluConversatie(conversatie.title)
                                                    // && setShowDropDown((prev) => !prev) 
                                                }
                                                    className="friends-credent"
                                                >
                                                    <div >
                                                        <span className="friends-name">{conversatie.title}</span>
                                                        <span className="friends-message">Id conversatie: {conversatie.id_conversatie}</span>
                                                        <span>UserId: {conversatie.userId}</span>
                                                    </div>
                                                    <span className="badge notif-badge">7</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Nu exista conversatii</p>
                                        )}
                                </div>
                            </div>

                        </section>

                        {/*RIGHT SECTION */}
                        <section className="main-right">
                            <div className="header-right">
                                <p className="name friend-dane">Titlu: {titluConversatie}</p>
                            </div>

                            {/*BUTOANE */}
                            <div className="some-btn">
                                <span className="glyphicon glyphicon-facetime-video" />
                                <span className="glyphicon glyphicon-earphone" />
                                <span className="glyphicon glyphicon-option-vertical option-btn" />
                            </div>

                            {/*CHAT AREA */}
                            <div className="chat-area">
                                {selectedConv === 0 ? (<AdaugaConversatie />)
                                    : (<div>{Array.isArray(mesage) && mesage.length > 0 ? (
                                        mesage.map((mesaj) => (
                                            mesaj.type === auth.type ? (
                                                <div className="your-chat">
                                                    <p className="your-chat-balloon">{mesaj.continut}</p>
                                                </div>
                                            ) : (
                                                <div className="friends-chat">
                                                    <p className="friends-chat-balloon">{mesaj.continut}</p>
                                                </div>
                                            )


                                        ))
                                    ) : (
                                        <p>Nu exista mesaje</p>
                                    )
                                    }
                                    </div>)}

                                {/*FRIENDS CHAT TEMPLATE */}
                                {/* <div className="friends-chat">
                                    <div className="friends-chat-content">
                                        <p className="friends-chat-name">Mario Gomez</p>
                                        <p className="friends-chat-balloon">Yo Dybala!</p>
                                        <h5 className="chat-datetime">Sun, Aug 30 | 15:41</h5>
                                    </div>
                                </div> */}

                                {/*YOUR CHAT TEMPLATE */}
                                {/* <div className="your-chat">
                                    <p className="your-chat-balloon">'sup</p>
                                    <p className="chat-datetime"><span className="glyphicon glyphicon-ok"></span> Sun, Aug 30 | 15:45</p>
                                </div> */}
                            </div>

                            {/*TYPING AREA */}
                            <div className="typing-area">
                                <input onChange={(e) => setNewMessage(e.target.value)}
                                    className="type-area" placeholder="Type something..." />

                                <div className="attach-btn">
                                    <span className="glyphicon glyphicon-paperclip file-btn"></span>
                                    <span className="glyphicon glyphicon-camera"></span>
                                    <span className="glyphicon glyphicon-picture"></span>
                                </div>

                                {/* <span className="glyphicon glyphicon-send send-btn" /> */}
                                <button type="button" onClick={() => handleSendMessage()}>Trimite</button>
                            </div>
                        </section>
                    </div>
                )}

                {auth?.type === "secretar" && (
                    <div className="app">

                        {/*LEFT SECTION*/}
                        <section className="main-left">

                            {/*HEADER */}
                            <div className="header-left">
                                {/* <span className="glyphicon glyphicon-menu-hamburger hamburger-btn"></span>
                                <span className="glyphicon glyphicon-search search-btn"></span>
                                <span className="glyphicon glyphicon-option-vertical option-btn"></span> */}
                                <AdaugaConversatie />
                            </div>

                            {/*CHAT LIST */}
                            <div className="chat-list">
                                <div className="friends">
                                    {Array.isArray(conversatii) && conversatii.length > 0 ?
                                        (
                                            conversatii.map((conversatie) => (
                                                <div onClick={() => setSelectedConv(conversatie.id_conversatie) &&
                                                    getMesaje()
                                                    && setTitluConversatie(conversatie.title)
                                                    // && setShowDropDown((prev) => !prev) 
                                                }
                                                    className="friends-credent"
                                                >
                                                    <div >
                                                        <span className="friends-name">{conversatie.title}</span>
                                                        <span className="friends-message">Id conversatie: {conversatie.id_conversatie}</span>
                                                        <span>UserId: {conversatie.userId}</span>
                                                    </div>
                                                    <span className="badge notif-badge">7</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p>Nu exista conversatii</p>
                                        )}
                                </div>
                            </div>

                        </section>

                        {/*RIGHT SECTION */}
                        <section className="main-right">
                            <div className="header-right">
                                <p className="name friend-dane">Titlu: {titluConversatie}</p>
                            </div>

                            {/*BUTOANE */}
                            <div className="some-btn">
                                <span className="glyphicon glyphicon-facetime-video" />
                                <span className="glyphicon glyphicon-earphone" />
                                <span className="glyphicon glyphicon-option-vertical option-btn" />
                            </div>

                            {/*CHAT AREA */}
                            <div className="chat-area">
                                {selectedConv === 0 ? (<AdaugaConversatie />)
                                    : (<div>{Array.isArray(mesage) && mesage.length > 0 ? (
                                        mesage.map((mesaj) => (
                                            mesaj.type === auth.type ? (
                                                <div className="your-chat">
                                                    <p className="your-chat-balloon">{mesaj.continut}</p>
                                                </div>
                                            ) : (
                                                <div className="friends-chat">
                                                    <p className="friends-chat-balloon">{mesaj.continut}</p>
                                                </div>
                                            )


                                        ))
                                    ) : (
                                        <p>Nu exista mesaje</p>
                                    )
                                    }
                                    </div>)}

                                {/*FRIENDS CHAT TEMPLATE */}
                                {/* <div className="friends-chat">
                                    <div className="friends-chat-content">
                                        <p className="friends-chat-name">Mario Gomez</p>
                                        <p className="friends-chat-balloon">Yo Dybala!</p>
                                        <h5 className="chat-datetime">Sun, Aug 30 | 15:41</h5>
                                    </div>
                                </div> */}

                                {/*YOUR CHAT TEMPLATE */}
                                {/* <div className="your-chat">
                                    <p className="your-chat-balloon">'sup</p>
                                    <p className="chat-datetime"><span className="glyphicon glyphicon-ok"></span> Sun, Aug 30 | 15:45</p>
                                </div> */}
                            </div>

                            {/*TYPING AREA */}
                            <div className="typing-area">
                                <input onChange={(e) => setNewMessage(e.target.value)}
                                    className="type-area" placeholder="Type something..." />

                                <div className="attach-btn">
                                    <span className="glyphicon glyphicon-paperclip file-btn"></span>
                                    <span className="glyphicon glyphicon-camera"></span>
                                    <span className="glyphicon glyphicon-picture"></span>
                                </div>

                                {/* <span className="glyphicon glyphicon-send send-btn" /> */}
                                <button type="button" onClick={() => handleSendMessage()}>Trimite</button>
                            </div>
                        </section>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ForumPage;