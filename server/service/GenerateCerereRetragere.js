const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Users } = require('../models');

const generateCerereRetragere = async (req, res) => {
    try {
        const student = await Users.findByPk(req.userId);
        if (!student) {
            return res.status(404).json({ message: 'Studentul nu a fost găsit.' });
        }

        // Calea către șablonul actualizat
        const templatePath = path.resolve(__dirname, '../templates/retragere_licenta_template.docx');
        const content = fs.readFileSync(templatePath, 'binary');

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Setarea variabilelor din modelul Users
        doc.setData({
            nume: `${student.firstName} ${student.lastName}`,
            grupa: student.grupa || '__________',
            program_studiu: student.program_studiu || '__________',
            an_studiu: student.an_studiu || '__________',
            forma_finantare: student.forma_finantare || '__________',
            forma_invatamant: student.forma_invatamant || '__________',
            facultate: student.facultate || '__________'
        });

        // Generarea documentului
        doc.render();
        const buffer = doc.getZip().generate({ type: 'nodebuffer' });

        // Trimiterea fișierului DOCX
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=cerere_retragere.docx');
        res.send(buffer);

    } catch (err) {
        console.error('Eroare la generarea cererii:', err);
        res.status(500).json({ message: 'Eroare la generarea cererii', error: err.message });
    }
};

module.exports = { generateCerereRetragere };
