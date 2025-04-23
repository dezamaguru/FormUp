const { Cereri } = require('../models');

const getAllCereri = async (req, res) => {
  try {
    const cereri = await Cereri.findAll( {
      attributes: ['id', 'title', 'filename']
    } );
    console.log('Cereri preluate:', cereri); // Depanare
    res.json(cereri);
  } catch (err) {
    console.error('Eroare la getAllCereri:', err); // Depanare
    res.status(500).json({ err: err.message });
  }
};

const uploadCerere = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    console.log('Titlu:', title); // Depanare
    console.log('Fișier:', file); // Depanare

    if (!file || !title) {
      return res.status(400).json({ message: "Titlul și fișierul sunt obligatorii!" });
    }

    // Creăm cererea și salvăm rezultatul
    const newCerere = await Cereri.create({
      title,
      mime_type: file.mimetype,
      filename: file.originalname,
      file_data: file.buffer,
    });

    // Returnăm doar datele necesare pentru frontend
    res.status(201).json({
      message: "Fișier salvat cu succes!",
      cerere: {
        id: newCerere.id,
        title: newCerere.title,
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
    const cerere = await Cereri.findByPk(req.params.id, {
      attributes: ['filename', 'mime_type', 'file_data'],
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
};
  
module.exports = { uploadCerere, downloadCerere, getAllCereri };