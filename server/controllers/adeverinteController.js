const { Solicitari_Adeverinte, Users} = require('../models');

const getAllAdeverinte = async(req, res) =>{
    try{
        if(req.type === 'student') {
            const adeverinte = await Solicitari_Adeverinte.findAll( {
                attributes: ['id_adeverinta', 'tip_adeverinta', 'userId', 'nume_student', 'status'],
                where: {
                    userId: req.userId, 
                }
            });

            //console.log('Adeverințe preluate:', adeverinte); 
            res.json(adeverinte);
        }

        if(req.type === 'secretar') {
            const secretar = await Users.findByPk(req.userId);
            if (!secretar) {
                return res.status(404).json({ message: "Profilul secretarului nu a fost găsit" });
            } 

            const adeverinte = await Solicitari_Adeverinte.findAll( {
                attributes: ['id_adeverinta', 'tip_adeverinta', 'userId', 'nume_student', 'status'],
                include :{
                    model: Users,
                    attributes: ['program_studiu', 'an_studiu'],
                    where:{
                        program_studiu: secretar.program_studiu,
                        an_studiu: secretar.an_studiu,
                        type: 'student'
                    }
                }
            });

            //console.log('Adeverințe preluate:', adeverinte); 
            res.json(adeverinte);
        }
    } catch (err) {
        console.error('Eroare la getAllAdeverinte:', err); 
        res.status(500).json({ err: err.message });
    }
};

const adaugaSolicitare = async (req, res) => {

    try { 
        const { name, tipAdeverinta } = req.body;

        if (!name || !tipAdeverinta) {
            return res.status(400).json({ 
                message: "Numele și tipul adeverinței sunt obligatorii!" 
            });
        }

        const newAdeverinta = await Solicitari_Adeverinte.create({
            tip_adeverinta: tipAdeverinta,
            userId: req.userId,
            nume_student: name,
            status: "Trimisa",
        }); 

        res.status(201).json({ 
            message: "Adeverință adăugată cu succes!",
            adeverinta: newAdeverinta 
        });
    } catch (err) {
        console.error('Eroare la adaugaSolicitare:', err); 
        res.status(500).json({ 
            message: "Eroare la adăugarea adeverinței",
            error: err.message 
        });
    }
};

const updateStatusAdeverinta = async (req, res) => {
    try{
        await Solicitari_Adeverinte.update(
            {
                status: "Procesare"
            },
            {
                where: {
                    id_adeverinta: req.params.id
                }
            }
        );

    } catch (err ){
        console.error('Eroare la updateStatusAdeverinta:', err); 
        res.status(500).json({ err: err.message });
    }
}

const getOneAdeverinta = async(req, res) => {
    try{
        const adeverinta = await Solicitari_Adeverinte.findOne( {
            where: {
                id_adeverinta: req.params.id,
            }
        });

        console.log('Adeverința preluata cu succes:', adeverinta); 
        res.json(adeverinta);
    } catch (err) {
        console.error('Eroare la getOneAdeverinta:', err); 
        res.status(500).json({ err: err.message });
    }
}

const uploadAdeverintaSolicitata = async (req, res) => {
    try {
        const file = req.file;

        console.log('Fisierul incarcat:', file);

        if(!file){
            return res.status(400)
            .json({message: "Fisierul trebuie incarcat obligatoriu"});
        }

        await Solicitari_Adeverinte.update(
            {
                mime_type: file.mimetype,
                file_data: file.buffer,
                status: "Aprobata"
            },
            {
                where: {
                    id_adeverinta: req.params.id
                }
            }
        );

        res.status(201).json({
            message:"Adeverinta incarcata cu succes!"
        });
    } catch (err) {
        console.error('Eroare la uploadAdeverintaSolicitata', err);
        res.status(500).json({ message: "Eroare la încărcarea fișierului", error: err.message });
    }
}

const downloadAdeverintaSolicitata = async (req, res) => {
    try {
        const adeverinta = await Solicitari_Adeverinte.findByPk(req.params.id,
            {
                attributes: ['tip_adeverinta', 'mime_type', 'file_data'],
            }
        );

        if(!adeverinta) {
            return res.status(404).json({message: "Adeverinta nu a fost gasita"});
        }

        if(!adeverinta.file_data) {
            return res.status(404).json({message: "Continutul adeverintei lipseste"});
        }

        // Adaugă extensia fișierului dacă lipsește
        let filename = adeverinta.tip_adeverinta;
        if (!filename.endsWith('.pdf')) {
            filename += '.pdf'; // Presupunem că fișierul este PDF
        }

        // Escapăm caracterele speciale
        filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');

        // Modificăm modul în care setăm numele fișierului în header
        res.setHeader('Content-Type', adeverinta.mime_type || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${adeverinta.tip_adeverinta}"`);
        res.setHeader('Content-Length', adeverinta.file_data.length);

    res.send(adeverinta.file_data);
    } catch(err){
        console.error('Eroare la descarcarea adeverintei: ', err);
        res.status(500).json({ message: "Eroare la descărcarea fișierului", error: err.message });
    }
}

module.exports = { adaugaSolicitare, getAllAdeverinte, getOneAdeverinta,
     uploadAdeverintaSolicitata, downloadAdeverintaSolicitata, updateStatusAdeverinta };