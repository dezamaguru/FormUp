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

const getAllSolicitariCereri = async(req, res) => {
    try{
        if(req.type === 'student') {
            const solicitari = await Solicitari_Cereri.findAll({
                attributes: ["id_solicitare", "id_cerere", "userId", "status"],
                where: {
                    userId: req.userId,
                }
            });

            console.log("Solicitari preluate: ", solicitari);
            return res.json(solicitari);
        }

        if(req.type === 'secretar') {
            const secretar = await Users.findByPk(req.userId);
            if(!secretar) {
                return res.status(404).json({message: "Profilul secretarului nu a fost gasit"});
            }

            const solicitari = await Solicitari_Cereri.findAll( {
                attributes: ["id_solicitare", "id_cerere", "userId", "status"],
                include: {
                    model: Users,
                    attributes: ['program_studiu', 'an_studiu'],
                    where: {
                        program_studiu: secretar.program_studiu,
                        an_studiu: secretar.an_studiu,
                        type: 'student'
                    }
                }
            });

            console.log("Solicitari preluate: ", solicitari);
            return res.json(solicitari);
        }

    } catch(err) {
        console.log("Eroare la  getAllSolicitariCereri: ", err);
        return res.status(500).json({message: "Eroare la getAllSolicitariCereri "});
    }
}

const getOneSolicitare = async(req, res) => {
    try{
        const solicitare = await Solicitari_Cereri.findOne({
            where:{
                id_solicitare: req.params.id,
            }
        })
        
        console.log("Solicitare gasita: ", solicitare);
        res.json(solicitare);
    } catch(err){
        console.log("Eroare la getOneSolicitare: ", err);
        res.status(500).json({ err: err.message });
    }
}

const updateStatusSolicitare = async (req, res) => {
    const { statusSolicitare } = req.body; 
    try{
        await Solicitari_Cereri.update(
            {
                status: statusSolicitare,
            },
            {
                where: {
                    id_solicitare: req.params.id,
                }
            }
        );
        console.log("Status solictare modificat cu succes!")
  
    } catch (err ){
        console.error('Eroare la updateStatusAdeverinta:', err); 
        res.status(500).json({ err: err.message });
    }
  }

module.exports = { uploadSolicitareCerere, getAllSolicitariCereri, getOneSolicitare, updateStatusSolicitare }