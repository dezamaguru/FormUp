const { Notificari } = require('../models');

const createNotificare = async (req, res) => {
    const { userId, titlu, mesaj, link_destinatie } = req.body;

    try {
        const notificare = await Notificari.create({
            userId,
            titlu,
            mesaj,
            link_destinatie
        });

        res.status(201).json(notificare);
    } catch (err) {
        console.error("Eroare createNotificare:", err);
        res.status(500).json({ error: err.message });
    }
};

const getNotificari = async (req, res) => {
    const userId = req.userId;

    try {
        const notificari = await Notificari.findAll({
            where: { userId },
            order: [['creat_la', 'DESC']]
        });

        res.json(notificari);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markAsRead = async (req, res) => {
    const { id_notificare } = req.params;

    try {
        await Notificari.update({ citita: true }, {
            where: { id_notificare }
        });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteNotificare = async (req, res) => {
    const { id_notificare } = req.body;
    try {
        const deleted = await Notificari.destroy({
            where: { id_notificare }
        });
        if (deleted) {
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Notificarea nu a fost găsită' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createNotificare,
    getNotificari,
    markAsRead,
    deleteNotificare
}
