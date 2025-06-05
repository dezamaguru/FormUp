const { Observatii_Cereri, Solicitari_Cereri, Users, Cereri } = require('../models');
const NotificationService = require("../service/NotificationService");

const getAllObservatii = async (req, res) => {
    try {
        const observatii = await Observatii_Cereri.findAll({
            attributes: ['id_observatie', 'id_solicitare', 'id_secretar', 'titlu', 'continut'],
            where: {
                id_solicitare: req.params.id,
            }
        });

        //console.log('Observatii preluate: ', observatii);
        return res.json(observatii);
    } catch (err) {
        console.log("Eroare la getAllObservatii: ", err);
        return res.status(500).json({ err: err.message });
    }
};


const uploadObservatie = async (req, res) => {
    try {
        const { title, continut } = req.body;

        const newObservatie = await Observatii_Cereri.create({
            titlu: title,
            continut: continut,
            id_solicitare: req.params.id,
            id_secretar: req.userId
        });

        //Trimite notificare către student
        const solicitare = await Solicitari_Cereri.findByPk(req.params.id);
        const student = await Users.findByPk(solicitare.userId);
        const cerere = await Cereri.findByPk(solicitare.id_cerere);

        if (student?.fcmToken) {
            await NotificationService.sendNotification(
                student.fcmToken,
                "Observatie noua",
                `Ai primit o noua observatie pentru ${solicitare.file_name}`
            )
        }

        res.status(201).json({
            message: "Observatie adaugata cu succes",
            observatie: newObservatie
        });

    } catch (err) {
        console.error('Eroare la uploadObservatie:', err);
        res.status(500).json({ message: "Eroare la uploadObservatie", error: err.message });
    }
}

const modifyObservatie = async (req, res) => {
    try {
        const { titleModificat, continutModificat, id_observatie } = req.body;

        await Observatii_Cereri.update(
            {
                titlu: titleModificat,
                continut: continutModificat
            }, {
            where: {
                id_observatie: id_observatie,
            }
        }
        );

        const solicitare = await Solicitari_Cereri.findByPk(req.params.id);
        const student = await Users.findByPk(solicitare.userId);
        const cerere = await Cereri.findByPk(solicitare.id_cerere);

        if (student?.fcmToken) {
            await NotificationService.sendNotification(
                student.fcmToken,
                "Observatie noua",
                `Ai primit o noua observatie pentru ${solicitare.file_name}`
            )
        }

        res.status(201).json({
            message: "Observatie modificata cu succes"
        });
    } catch (err) {
        console.error('Eroare la modifyObservatie:', err);
        res.status(500).json({ err: err.message });
    }
}

const deleteObservatie = async (req, res) => {
    try {
        const { id_observatie } = req.body;
        await Observatii_Cereri.destroy({
            where: {
                id_observatie: id_observatie
            }
        });

        res.status(201).json({
            message: "Observatie stearsa cu succes"
        });
    } catch (err) {
        console.error('Eroare la modifyObservatie:', err);
        res.status(500).json({ err: err.message });
    }
}
module.exports = { getAllObservatii, uploadObservatie, modifyObservatie, deleteObservatie }