const { Solicitari_Adeverinte, Users } = require('../models');
const NotificationService = require("../service/NotificationService");
const EmailService = require("../service/EmailService");
const { generatePDFBuffer } = require("../service/GeneratePDFService");
// const path = require("path");
// const { off } = require('process');

const getAllAdeverinte = async (req, res) => {
    try {
        const page = parseInt(req.query.pageNumber) || 0;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const offset = page * pageSize;
        const limit = pageSize;

        if (req.type === 'student') {
            const { rows: adeverinte, count } = await Solicitari_Adeverinte.findAndCountAll({
                attributes: ['id_adeverinta', 'tip_adeverinta', 'userId', 'nume_student', 'status'],
                where: { userId: req.userId },
                offset,
                limit,
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json({ data: adeverinte, count });
        }

        if (req.type === 'secretar') {
            const secretar = await Users.findByPk(req.userId);
            if (!secretar) {
                return res.status(404).json({ message: "Profilul secretarului nu a fost găsit" });
            }
            const { rows: adeverinte, count } = await Solicitari_Adeverinte.findAndCountAll({
                attributes: ['id_adeverinta', 'tip_adeverinta', 'userId', 'nume_student', 'status'],
                include: {
                    model: Users,
                    attributes: ['program_studiu', 'an_studiu'],
                    where: {
                        program_studiu: secretar.program_studiu,
                        an_studiu: secretar.an_studiu,
                        type: 'student'
                    }
                },
                offset,
                limit,
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json({ data: adeverinte, count });
        }
    } catch (err) {
        console.error('Eroare la getAllAdeverinte:', err);
        res.status(500).json({ err: err.message });
    }
};

const adaugaSolicitare = async (req, res) => {

    try {
        const { tipAdeverinta } = req.body;

        if (!tipAdeverinta) {
            return res.status(400).json({
                message: "Numele și tipul adeverinței sunt obligatorii!"
            });
        }

        const student = await Users.findByPk(req.userId);

        //cauta userii catre care sa trimiti notificarile
        const secretari = await Users.findAll({
            where: {
                type: 'secretar',
                program_studiu: student.program_studiu,
                an_studiu: student.an_studiu
            }
        });

        //trimite notificarea catre toti userii
        await Promise.all(secretari.map(sec => {
            if (sec.fcmToken) {
                return NotificationService.sendNotification(
                    sec.fcmToken,
                    "Solicitare nouă de adeverință",
                    `Studentul ${student.lastName} ${student.firstName} a trimis o cerere pentru ${tipAdeverinta}`
                );
            }
        }));

        //trimite mail
        await Promise.all(secretari.map(sec => {
            if (sec.email) {
                return EmailService.sendEmail({
                    to: sec.email,
                    subject: "Solicitare nouă de adeverință",
                    text: `Studentul ${student.lastName} ${student.firstName} a trimis o cerere pentru adeverința: ${tipAdeverinta}`,
                    html: `<p>Studentul <strong>${student.lastName} ${student.firstName}</strong> a trimis o cerere pentru adeverința: <strong>${tipAdeverinta}</strong>.</p>`,
                });
            }
        }));

        //generare pdf
        const formaInvatamantText = student.forma_invatamant === "IF"
            ? "CU FRECVENȚĂ"
            : "LA DISTANȚĂ";

        // Construiește datele pentru template
        const pdfData = {
            nume: `${student.lastName} ${student.firstName}`,
            data_nasterii: "05 ianuarie 2003", // adaugă câmp real dacă ai
            an_universitar: "2024–2025", // hardcodat sau calculat
            ciclu: `${student.program_studiu}`,
            an_studiu: student.an_studiu,
            forma_finantare: student.forma_finantare,
            motiv: tipAdeverinta,
            program_studiu: student.program_studiu,
            domeniu: "CIBERNETICĂ, STATISTICĂ ȘI INFORMATICĂ ECONOMICĂ",
            forma_invatamant: formaInvatamantText,
            limba: "Română",
            locatie: "București",
            nr_adeverinta: Math.floor(1000 + Math.random() * 9000),
            data_emitere: new Date().toLocaleDateString("ro-RO"),
        };

        // Generează PDF din template
        //const pdfBuffer = await generatePDFBuffer("adeverinta", pdfData);
        const raw = await generatePDFBuffer("adeverinta", pdfData, true);
        const pdfBuffer = Buffer.from(raw); // forțează conversia

        // Salvează în baza de date
        const newAdeverinta = await Solicitari_Adeverinte.create({
            tip_adeverinta: tipAdeverinta,
            userId: req.userId,
            nume_student: `${student.lastName} ${student.firstName}`,
            status: "Aprobata",
            filename: `adeverinta_${student.lastName}_${student.firstName}.pdf`,
            mime_type: "application/pdf",
            file_data: pdfBuffer,
        });

        // console.log("TIP:", typeof pdfBuffer);                 // trebuie să fie 'object'
        // console.log("INSTANȚĂ:", pdfBuffer instanceof Buffer); // trebuie să fie true
        // console.log("IS BUFFER:", Buffer.isBuffer(pdfBuffer)); // true

        res.status(201).json({
            message: "Adeverință adăugată cu succes!",
            //adeverinta: newAdeverinta
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
    try {
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

        const adeverinta = await Solicitari_Adeverinte.findByPk(req.params.id);
        const student = await Users.findByPk(adeverinta.userId);

        if (student.fcmToken) {
            return NotificationService.sendNotification(
                student.fcmToken,
                "Adeverinta vazuta",
                `Adevrinta ${adeverinta.tip_adeverinta} a fost vazuta de un responsabil`
            );
        }

        // Trimite email către student
        await EmailService.sendEmail({
            to: student.email,
            subject: "Adeverința este în procesare",
            text: `Cererea ta pentru adeverința "${adeverinta.tip_adeverinta}" a fost preluată și este în curs de procesare.`,
            html: `
                <p>Bună, ${student.name || "student"}</p>
                <p>Cererea ta pentru adeverința <strong>${adeverinta.tip_adeverinta}</strong> a fost <strong>văzută</strong> de secretariat și este acum în curs de procesare.</p>
                <p>Vei fi notificat(ă) când documentul este gata pentru descărcare.</p>
                <br/>
                <p>Cu stimă,</p>
                <p><strong>FormUp</strong></p>
            `
        });

    } catch (err) {
        console.error('Eroare la updateStatusAdeverinta:', err);
        res.status(500).json({ err: err.message });
    }
}

const getOneAdeverinta = async (req, res) => {
    try {
        const adeverinta = await Solicitari_Adeverinte.findOne({
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

        if (!file) {
            return res.status(400)
                .json({ message: "Fisierul trebuie incarcat obligatoriu" });
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

        const adeverinta = await Solicitari_Adeverinte.findByPk(req.params.id);
        const student = await Users.findByPk(adeverinta.userId);
        if (student.fcmToken) {
            return NotificationService.sendNotification(
                student.fcmToken,
                "Adeverinta aprobata",
                `Adeverinta ${adeverinta.tip_adeverinta} poate fi descarcata`
            );
        }

        await EmailService.sendEmail({
            to: student.email,
            subject: "Adeverința ta a fost aprobată",
            text: `Adeverința solicitată (${adeverinta.tip_adeverinta}) a fost aprobată și este disponibilă pentru descărcare din platformă.`,
            html: `
                <p>Bună, ${student.firstName} ${student.lastName},</p>
                <p>Adeverința ta pentru <strong>${adeverinta.tip_adeverinta}</strong> a fost aprobată.</p>
                <p>O poți descărca din platforma <strong>FormUp</strong> accesând secțiunea „Adeverințe”.</p>
                <br/>
                <p>Cu stimă,</p>
                <p>Echipa FormUp</p>
            `
        });

        res.status(201).json({
            message: "Adeverinta incarcata cu succes!"
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
                attributes: ['tip_adeverinta', 'mime_type', 'file_data', 'filename'], //
            }
        );

        if (!adeverinta) {
            return res.status(404).json({ message: "Adeverinta nu a fost gasita" });
        }

        if (!adeverinta.file_data) {
            return res.status(404).json({ message: "Continutul adeverintei lipseste" });
        }

        let filename = adeverinta.filename;
        filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');


        // Modificăm modul în care setăm numele fișierului în header
        res.setHeader('Content-Type', adeverinta.mime_type || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', adeverinta.file_data.length);

        res.send(adeverinta.file_data);
    } catch (err) {
        console.error('Eroare la descarcarea adeverintei: ', err);
        res.status(500).json({ message: "Eroare la descărcarea fișierului", error: err.message });
    }
}


module.exports = {
    adaugaSolicitare, getAllAdeverinte, getOneAdeverinta,
    uploadAdeverintaSolicitata, downloadAdeverintaSolicitata,
    updateStatusAdeverinta
};