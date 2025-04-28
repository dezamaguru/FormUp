const { Cereri, Sequelize } = require('../models');
const { Users } = require('../models');
const { Solicitari_Cereri } = require('../models');

const uploadSolicitareCerere = async(req, res) => {
    try{
        const id_cerere = req.params.id;
        const file = req.file;
  
        console.log("ID cerere:", id_cerere);
        console.log("ID utilizator:", req.userId);
        console.log("Fișier:", file);

        if (!file) {
            return res.status(400).json({ message: "Fisierul nu a fost incarcat!" });
        }

        if (!req.userId) {
            return res.status(400).json({ message: "ID-ul utilizatorului lipsește!" });
        }

        const newSolicitare = await Solicitari_Cereri.create({
            id_cerere: id_cerere,
            userId: req.userId,
            status: "Trimisa",
            mime_type: file.mimetype,
            filename: file.originalname,
            file_data: file.buffer,
        });
  
        res.status(201).json({
            message: "Solicitare salvată cu succes!",
            newSolicitare: {
                id_cerere: newSolicitare.id_cerere,
                userId: newSolicitare.userId,
                status: newSolicitare.status,
                filename: newSolicitare.filename
            }
        });
      
    } catch(err) {
        console.error('Eroare la uploadCerere:', err);
        res.status(500).json({ message: "Eroare la încărcarea fișierului", error: err.message });
    }
}

module.exports = { uploadSolicitareCerere }