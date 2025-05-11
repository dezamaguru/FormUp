const { Conversatii, Mesaje, Users } = require('../models');

const getAllConversatii = async (req, res) => {
    try {

        if (req.type === "student") {
            const conversatii = await Conversatii.findAll({
                attributes: ['id_conversatie', 'title', 'userId'],
                where: {
                    userId: req.userId,
                }
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
                }
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
            an_studiu: user.an_studiu
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

        console.log("Date primite:", { selectedConv, newMessage });

        const message = await Mesaje.create({
            id_conversatie: selectedConv,
            id_expeditor: req.userId,
            continut: newMessage,
            type: req.type,
        });

        console.log("Mesaj salvat:", message);

        res.status(201).json(message);
    } catch (err) {
        console.error("Eroare la sendMessage:", err);
        res.status(500).json({ message: "Eroare la sendMessage", error: err.message });
    }
}

module.exports = { getAllConversatii, uploadConversatie, sendMessage, getAllMessages }