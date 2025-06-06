const { Cereri, Sequelize } = require('../models');
const { Users } = require('../models');
const EmailService = require("../service/EmailService");

const getAllCereri = async (req, res) => {
  try {
    const user = await Users.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found in getAllCereri" });
    }

    let program_studiu = user.program_studiu;

    if (user.type === "student") {
      const cereri = await Cereri.findAll({
        attributes: ["id_cerere", "title", "filename"],
        where: {
          type: {
            [Sequelize.Op.in]: [program_studiu, "comun", "altele"],
          },
        },
      });

      console.log("Cereri preluate:", cereri);
      return res.json(cereri);
    }

    if (user.type === "secretar") {
      const cereri = await Cereri.findAll({
        attributes: ["id_cerere", "title", "filename"],
      });

      //console.log("Cereri preluate:", cereri); 
      return res.json(cereri);
    }
  } catch (err) {
    console.error("Eroare la getAllCereri:", err);
    return res.status(500).json({ err: err.message });
  }
};

const uploadCerere = async (req, res) => {
  try {
    const { title } = req.body;
    const { type } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400)
        .json({ message: "Fisierul nu a fost incarcat!" });
    }

    if (!title) {
      return res.status(400)
        .json({ message: "Titlul nu a fost completat!" });
    }

    if (!type) {
      return res.status(400)
        .json({ message: "Nu s-a ales tipul cererii!" });
    }

    // Creăm cererea și salvăm rezultatul
    const newCerere = await Cereri.create({
      title,
      type,
      mime_type: file.mimetype,
      filename: file.originalname,
      file_data: file.buffer,
    });

    // Găsește toți secretarii
    const secretari = await Users.findAll({
      where: { type: 'secretar' }
    });

    // Trimite câte un email fiecărui secretar
    await Promise.all(secretari.map(secretar => {
      return EmailService.sendEmail({
        to: secretar.email,
        subject: "Cerere nouă adăugată în platformă",
        text: `A fost adăugată o nouă cerere de tip: ${newCerere.type} cu titlul: ${newCerere.title}.`,
        html: `
      <p>Bună ziua,</p>
      <p>A fost adăugată o nouă cerere în platformă:</p>
      <ul>
        <li><strong>Tip:</strong> ${newCerere.type}</li>
        <li><strong>Titlu:</strong> ${newCerere.title}</li>
        <li><strong>Fișier:</strong> ${newCerere.filename}</li>
      </ul>
      <p>Vă rugăm să o verificați în secțiunea corespunzătoare din interfața secretariatului.</p>
      <br/>
      <p>Cu stimă,<br/>Echipa FormUp</p>
    `
      });
    }));


    // Returnăm doar datele necesare pentru frontend
    res.status(201).json({
      message: "Fișier salvat cu succes!",
      cerere: {
        id_cerere: newCerere.id_cerere,
        title: newCerere.title,
        type: newCerere.type,
        filename: newCerere.filename
      }
    });


  } catch (err) {
    console.error('Eroare la uploadCerere:', err);
    res.status(500).json({ message: "Eroare la încărcarea fișierului", error: err.message });
  }
};

const downloadCerere = async (req, res) => {
  try {

    const cerere = await Cereri.findOne({
      attributes: ['filename', 'mime_type', 'file_data'],
      where: {
        id_cerere: req.params.id,
      }
    });

    if (!cerere) {
      return res.status(404).json({ message: "Fișierul nu a fost găsit." });
    }

    if (!cerere.file_data) {
      return res.status(404).json({ message: "Conținutul fișierului lipsește." });
    }

    // Modificăm modul în care setăm numele fișierului în header
    res.setHeader('Content-Type', cerere.mime_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${cerere.filename}"`);
    res.setHeader('Content-Length', cerere.file_data.length);

    // Trimitem datele
    res.send(cerere.file_data);
  } catch (err) {
    console.error('Eroare la descărcare:', err);
    res.status(500).json({ message: "Eroare la descărcarea fișierului", error: err.message });
  }
}

const getOneCerereTip = async (req, res) => {
  try {
    const cerere = await Cereri.findOne({
      where: {
        id_cerere: req.params.id,
      }
    });

    console.log("Cerere gasita: ", cerere);
    res.json(cerere);
  } catch (err) {
    console.error('Eroare la getOneCerereTip:', err);
    res.status(500).json({ err: err.message });
  }
}

const modifyCerere = async (req, res) => {
  try {
    const { title } = req.body;
    const { type } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400)
        .json({ message: "Fisierul nu a fost incarcat!" });
    }

    if (!title) {
      return res.status(400)
        .json({ message: "Titlul nu a fost completat!" });
    }

    if (!type) {
      return res.status(400)
        .json({ message: "Nu s-a ales tipul cererii!" });
    }

    const cerereModificata = await Cereri.update({
      title,
      type,
      mime_type: file.mimetype,
      filename: file.originalname,
      file_data: file.buffer,
    }, {
      where: {
        id_cerere: req.params.id,
      }
    });

    res.status(201).json({
      message: "Fișier salvat cu succes!",
      cerere: {
        id_cerere: cerereModificata.id_cerere,
        title: cerereModificata.title,
        type: cerereModificata.type,
        filename: cerereModificata.filename
      }
    });
  } catch (err) {
    console.error('Eroare la modifyCerere:', err);
    res.status(500).json({ message: "Eroare la încărcarea fișierului", error: err.message });
  }
}

const deleteCerere = async (req, res) => {
  try {
    const { id_cerere } = req.body;
    await Cereri.destroy({
      where: {
        id_cerere: id_cerere
      }
    });

    res.status(201).json({ message: "Cerere stearsa" });
  } catch (err) {
    console.error('Eroare la deleteCerere:', err);
    res.status(500).json({ message: "Eroare la deleteCerere", error: err.message });
  }
}

module.exports = { uploadCerere, downloadCerere, getAllCereri, getOneCerereTip, modifyCerere, deleteCerere };