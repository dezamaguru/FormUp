const { Conversatii, Mesaje, Users, Notificari } = require('../models');
const NotificationService = require('../service/NotificationService');
const EmailService = require("../service/EmailService");

const getAllConversatii = async (req, res) => {
    try {

        if (req.type === "student") {
            const conversatii = await Conversatii.findAll({
                attributes: ['id_conversatie', 'title', 'userId'],
                where: {
                    userId: req.userId,
                },
                order: [['createdAt', 'DESC']],
                include: {
                    model: Users,
                    attributes: ['userId', 'lastName', 'firstName', 'program_studiu', 'an_studiu', 'facultate']
                },
                order: [['createdAt', 'DESC']]
            });
            res.status(201).json(conversatii);

            console.log("Conversatii: ", conversatii);
        }

        if (req.type === "secretar") {
            const user = await Users.findByPk(req.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found in getAllCereri" });
            }

            const conversatii = await Conversatii.findAll({
                attributes: ['id_conversatie', 'title', 'userId'],
                where: {
                    program_studiu: user.program_studiu,
                    an_studiu: user.an_studiu
                },
                include: {
                    model: Users,
                    attributes: ['userId', 'lastName', 'firstName', 'program_studiu', 'an_studiu', 'facultate']
                },
                order: [['createdAt', 'DESC']]
            });
            res.status(201).json(conversatii);

            console.log("Conversatii: ", conversatii);
        }



    } catch (err) {
        console.error("Eroare la getAllCereri:", err);
        return res.status(500).json({ err: err.message });
    }
}

const uploadConversatie = async (req, res) => {
    try {
        const user = await Users.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found in uploadConversatie" });
        }

        const { titlu } = req.body;
        const newConversatie = await Conversatii.create({
            userId: req.userId,
            title: titlu,
            program_studiu: user.program_studiu,
            an_studiu: user.an_studiu,
            id_student: req.type === 'student' ? req.userId : null,
            id_secretar: req.type === 'secretar' ? req.userId : null
        });

        res.status(201).json({
            message: "Conversatie adaugata!",
            conversatie: newConversatie
        });
    } catch (err) {
        console.error('Eroare la uploadConversatie:', err);
        res.status(500).json({
            message: "Eroare la uploadConversatie",
            error: err.message
        });
    }
}

const getAllMessages = async (req, res) => {
    try {

        const mesaje = await Mesaje.findAll({
            attributes: ['id_mesaj', 'id_conversatie', 'id_expeditor', 'type', 'continut'],
            where: {
                id_conversatie: req.params.id
            }
        });

        res.status(200).json(mesaje);
    } catch (err) {
        console.error("Eroare la getAllMessages:", err);
        res.status(500).json({ message: "Eroare la getAllMessages", error: err.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { selectedConv, newMessage } = req.body;

        if (!selectedConv || !newMessage) {
            return res.status(400).json({ message: "Datele sunt incomplete!" });
        }

        const conv = await Conversatii.findByPk(selectedConv);
        if (!conv) {
            return res.status(404).json({ message: "Conversația nu a fost găsită" });
        }

        const message = await Mesaje.create({
            id_conversatie: selectedConv,
            id_expeditor: req.userId,
            continut: newMessage,
            type: req.type,
        });

        const expeditor = await Users.findByPk(req.userId);
        const expeditorNume = expeditor?.firstName || expeditor?.email || "Utilizator";

        console.log("Expeditor:", expeditorNume);
        console.log("Tip expeditor:", req.type);

        // Găsim destinatarul în funcție de tipul expeditorului
        let destinatarId = null;
        if (req.type === 'student') {
            // Dacă expeditorul este student, destinatarul este secretarul
            const secretari = await Users.findAll({
                where: {
                    type: 'secretar',
                    program_studiu: conv.program_studiu,
                    an_studiu: conv.an_studiu
                }
            });
            if (secretari.length > 0) {
                destinatarId = secretari[0].userId;
                console.log("Destinatar (secretar) găsit:", destinatarId);
            }
        } else if (req.type === 'secretar') {
            // Dacă expeditorul este secretar, destinatarul este studentul
            destinatarId = conv.userId;
            console.log("Destinatar (student) găsit:", destinatarId);
        }

        if (!destinatarId) {
            console.warn(`Nu a fost găsit destinatarul pentru conversația ${selectedConv}`);
        } else {
            const destinatar = await Users.findByPk(destinatarId);
            console.log("Detalii destinatar:", {
                id: destinatar?.userId,
                type: destinatar?.type,
                fcmToken: destinatar?.fcmToken ? "Existent" : "Lipseste"
            });

            if (destinatar?.fcmToken) {
                try {
                    await NotificationService.sendNotification(
                        destinatar.fcmToken,
                        `Mesaj nou de la ${expeditorNume}`,
                        newMessage
                    );
                    //console.log("Notificare trimisă cu succes către:", destinatarId);

                    // Salvează notificarea în baza de date
                    await Notificari.create({
                        userId: destinatar.userId,
                        titlu: `Mesaj nou de la ${expeditorNume}`,
                        mesaj: `Ai primit un mesaj: "${newMessage}"`,
                        link_destinatie: `/inbox`,
                    });


                    // Trimite email
                    await EmailService.sendEmail({
                        to: destinatar.email,
                        subject: `Mesaj nou de la ${expeditorNume} în FormUp`,
                        text: `Ai primit un mesaj nou:\n\n${newMessage}`,
                        html: `
                                <p>Bună, ${destinatar.firstName} ${destinatar.lastName},</p>
                                <p>Ai primit un mesaj nou în platforma <strong>FormUp</strong> de la <strong>${expeditorNume}</strong>.</p>
                                <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                                    ${newMessage}
                                </blockquote>
                                <p>Pentru a răspunde, intră în secțiunea „Inbox” din platformă.</p>
                                <br/>
                                <p>Cu stimă,<br/>Echipa FormUp</p>
                                `
                    });

                } catch (notifErr) {
                    console.error("Eroare la trimiterea notificării:", notifErr);
                }
            } else {
                console.warn("Destinatarul nu are token FCM configurat");
            }
        }

        //console.log("Mesaj salvat:", message);
        res.status(201).json(message);
    } catch (err) {
        console.error("Eroare la sendMessage:", err);
        res.status(500).json({ message: "Eroare la sendMessage", error: err.message });
    }
}


module.exports = { getAllConversatii, uploadConversatie, sendMessage, getAllMessages }