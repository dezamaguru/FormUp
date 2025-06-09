const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Users } = require('../models');

const generareFisaLichidare = async (req, res) => {
    try {
        const student = await Users.findByPk(req.userId);
        if (!student) {
            return res.status(404).json({ message: 'Studentul nu a fost găsit.' });
        }

        const templatePath = path.resolve(__dirname, '../templates/fisa_de_lichidare.docx');
        const content = fs.readFileSync(templatePath, 'binary');

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        doc.setData({
            nume: `${student.firstName} ${student.lastName}`,
            an_studiu: student.an_studiu || '__________',
            program_studiu: student.program_studiu || '__________',
            grupa: student.grupa || '__________',
            forma_invatamant: student.forma_invatamant || '__________'
        });

        doc.render();
        const buffer = doc.getZip().generate({ type: 'nodebuffer' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=cerere_contestatie.docx');
        res.send(buffer);

    } catch (err) {
        console.error('Eroare la generarea cererii:', err);
        res.status(500).json({ message: 'Eroare la generarea cererii', error: err.message });
    }
}

module.exports = { generareFisaLichidare };