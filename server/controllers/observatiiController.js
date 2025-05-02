const { Observatii_Cereri } = require('../models');

const getAllObservatii = async (req, res) => {
    try {
        const observatii = await Observatii_Cereri.findAll({
            attributes: ['id_observatie', 'id_solicitare', 'id_secretar','titlu', 'continut'],
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

        res.status(201).json({ message: "Observatie adaugata cu succes",
            observatie: newObservatie
         });
    } catch (err) {
        console.error('Eroare la uploadObservatie:', err);
        res.status(500).json({ message: "Eroare la uploadObservatie", error: err.message });
    }
}
module.exports = { getAllObservatii, uploadObservatie }