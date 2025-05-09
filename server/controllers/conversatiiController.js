const { Conversatii, Mesaje } = require('../models');

const getAllConversatii = async (req, res) => {
    try {
        const conversatii = await Conversatii.findAll({
            attributes: ['title'],
            where: {
                userId: req.userId,
            }
        });

        console.log("Conversatii: ", conversatii);
    } catch (err) {
        console.error("Eroare la getAllCereri:", err);
        return res.status(500).json({ err: err.message });
    }
}

const uploadConversatie = async (req, res) => {
    try {
        const { titlu } = req.body;
        const newConversatie = await Conversatii.create({
            userId: req.userId,
            title: titlu
        });

        res.status(201).json({
            message: "Conversatie adaugata!",
            conversatie: newConversatie
        })
    } catch (err) {
        console.error('Eroare la uploadConversatie:', err);
        res.status(500).json({
            message: "Eroare la uploadConversatie",
            error: err.message
        });
    }
}

module.exports = { getAllConversatii, uploadConversatie }