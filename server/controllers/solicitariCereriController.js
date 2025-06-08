const { Cereri, Sequelize } = require('../models');
const { Users } = require('../models');
const { Solicitari_Cereri } = require('../models');
const NotificationService = require("../service/NotificationService");
const EmailService = require("../service/EmailService");


const uploadSolicitareCerere = async (req, res) => {
    try {
        const id_cerere = req.params.id;
        const file = req.file;

        // console.log("ID cerere:", id_cerere);
        // console.log("ID utilizator:", req.userId);
        // console.log("Fișier:", file);

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
            file_name: file.originalname, // <-- corect
            file_data: file.buffer,
        });

        const student = await Users.findByPk(req.userId);
        const cerere = await Cereri.findByPk(id_cerere);

        //Notificare către secretarii relevanți
        const secretari = await Users.findAll({
            where: {
                type: 'secretar',
                program_studiu: student.program_studiu,
                an_studiu: student.an_studiu
            }
        });

        await Promise.all(secretari.map(sec => {
            const notificare = sec.fcmToken
                ? NotificationService.sendNotification(
                    sec.fcmToken,
                    "Solicitare nouă de cerere",
                    `Studentul ${student.firstName} ${student.lastName} a trimis o solicitare pentru: ${cerere.title}`
                )
                : Promise.resolve();

            const email = EmailService.sendEmail({
                to: sec.email,
                subject: "Solicitare nouă primită",
                text: `Studentul ${student.firstName} ${student.lastName} a trimis o solicitare pentru cererea: ${cerere.title}.`,
                html: `
      <p>Bună ziua,</p>
      <p>Studentul <strong>${student.firstName} ${student.lastName}</strong> a trimis o solicitare pentru cererea:</p>
      <ul>
        <li><strong>${cerere.title}</strong></li>
        <li><strong>Program de studiu:</strong> ${student.program_studiu}</li>
        <li><strong>An de studiu:</strong> ${student.an_studiu}</li>
      </ul>
      <p>Puteți vizualiza această solicitare în platformă în secțiunea corespunzătoare.</p>
      <br/>
      <p>Cu stimă,<br/>Echipa FormUp</p>
    `
            });

            return Promise.all([notificare, email]);
        }));




        res.status(201).json({
            message: "Solicitare salvată cu succes!",
            newSolicitare: {
                id_cerere: newSolicitare.id_cerere,
                userId: newSolicitare.userId,
                status: newSolicitare.status,
                filename: newSolicitare.filename
            }
        });

    } catch (err) {
        console.error('Eroare la uploadCerere:', err);
        res.status(500).json({ message: "Eroare la încărcarea fișierului", error: err.message });
    }
}

const getAllSolicitariCereri = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const pageSize = parseInt(req.query.pageSize) || 5;

        const limit = pageSize;
        const offset = page * pageSize;

        if (req.type === 'student') {
            const { count, rows } = await Solicitari_Cereri.findAndCountAll({
                attributes: ["id_solicitare", "id_cerere", "userId", "status"],
                where: {
                    userId: req.userId,
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return res.json({ solicitari: rows, total: count });
        }

        if (req.type === 'secretar') {
            const secretar = await Users.findByPk(req.userId);
            if (!secretar) {
                return res.status(404).json({ message: "Profilul secretarului nu a fost gasit" });
            }

            const { count, rows } = await Solicitari_Cereri.findAndCountAll({
                attributes: ["id_solicitare", "id_cerere", "userId", "status"],
                include: {
                    model: Users,
                    attributes: ['program_studiu', 'an_studiu'],
                    where: {
                        program_studiu: secretar.program_studiu,
                        an_studiu: secretar.an_studiu,
                        type: 'student'
                    }
                },
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return res.json({ solicitari: rows, total: count });
        }

    } catch (err) {
        console.log("Eroare la getAllSolicitariCereri: ", err);
        return res.status(500).json({ message: "Eroare la getAllSolicitariCereri " });
    }
}

const getOneSolicitare = async (req, res) => {
    try {
        const solicitare = await Solicitari_Cereri.findOne({
            where: {
                id_solicitare: req.params.id,
            }
        })

        console.log("Solicitare gasita: ", solicitare);
        res.json(solicitare);
    } catch (err) {
        console.log("Eroare la getOneSolicitare: ", err);
        res.status(500).json({ err: err.message });
    }
}

const updateStatusSolicitare = async (req, res) => {
    const { statusSolicitare } = req.body;
    try {
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

        const solicitare = await Solicitari_Cereri.findByPk(req.params.id);
        const student = await Users.findByPk(solicitare.userId);

        if (student.fcmToken) {
            return NotificationService.sendNotification(
                student.fcmToken,
                "Status solicitare modificat",
                `Solicitarea ${solicitare.file_name} a fost vizualizata`
            )
        }

        // Email
        await EmailService.sendEmail({
            to: student.email,
            subject: "Actualizare privind solicitarea ta",
            text: `Solicitarea ta pentru fișierul "${solicitare.file_name}" a fost actualizată cu statusul: ${statusSolicitare}.`,
            html: `
                <p>Bună, ${student.firstName} ${student.lastName},</p>
                <p>Statusul solicitării tale pentru <strong>${solicitare.file_name}</strong> a fost actualizat:</p>
                <p><strong>Status curent:</strong> ${statusSolicitare}</p>
                <br/>
                <p>Poți verifica detalii în platforma FormUp.</p>
                <p>Cu stimă,<br/>Echipa FormUp</p>
            `
        });

        res.status(200);

    } catch (err) {
        console.error('Eroare la updateStatusAdeverinta:', err);
        res.status(500).json({ err: err.message });
    }
}

module.exports = {
    uploadSolicitareCerere,
    getAllSolicitariCereri,
    getOneSolicitare,
    updateStatusSolicitare
}