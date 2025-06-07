const { Solicitari_Cereri } = require('../models');
const { Users } = require('../models');
const { Solicitari_Adeverinte } = require('../models');
const { Op } = require("sequelize");

const getStatisticiGenerale = async (req, res) => {
    try {
        const { program_studiu, an_studiu, facultate, forma_finantare } = req.query;

        // Construim condiția de filtrare
        const userWhere = {
            ...(program_studiu && { program_studiu }),
            ...(an_studiu && { an_studiu }),
            ...(facultate && { facultate }),
            ...(forma_finantare && { forma_finantare }),
            type: 'student'
        };

        // Obține toți studenții care corespund filtrului
        const studentiFiltrati = await Users.findAll({ where: userWhere });
        const userIds = studentiFiltrati.map(u => u.userId);

        // Dacă nu există studenți potriviți, returnăm 0
        if (userIds.length === 0) {
            return res.json({
                totalCereri: 0,
                cereriProcesate: 0,
                cereriInAsteptare: 0,
                totalAdeverinte: 0
            });
        }

        // Query-urile de statistici
        const [
            totalCereri,
            cereriProcesate,
            cereriInAsteptare,
            totalAdeverinte
        ] = await Promise.all([
            Solicitari_Cereri.count({ where: { userId: { [Op.in]: userIds } } }),
            Solicitari_Cereri.count({
                where: {
                    userId: { [Op.in]: userIds },
                    status: ['Aprobata', 'Respinsa']
                }
            }),
            Solicitari_Cereri.count({
                where: {
                    userId: { [Op.in]: userIds },
                    status: ['Trimisa', 'Procesare']
                }
            }),
            Solicitari_Adeverinte.count({ where: { userId: { [Op.in]: userIds } } }),
        ]);

        return res.json({
            totalCereri,
            cereriProcesate,
            cereriInAsteptare,
            totalAdeverinte
        });
    } catch (err) {
        console.error("Eroare la getStatisticiGenerale:", err);
        res.status(500).json({ error: "Eroare la încărcarea statisticilor generale" });
    }
};

const getDistribuireStatusuri = async (req, res) => {
    try {
        const filters = {};

        if (req.query.program_studiu) filters.program_studiu = req.query.program_studiu;
        if (req.query.an_studiu) filters.an_studiu = req.query.an_studiu;
        if (req.query.facultate) filters.facultate = req.query.facultate;
        if (req.query.forma_finantare) filters.forma_finantare = req.query.forma_finantare;

        const [cereri, adeverinte] = await Promise.all([
            Solicitari_Cereri.findAll({
                attributes: ['status'],
                include: {
                    model: Users,
                    attributes: [],
                    where: filters
                }
            }),
            Solicitari_Adeverinte.findAll({
                attributes: ['status'],
                include: {
                    model: Users,
                    attributes: [],
                    where: filters
                }
            })
        ]);

        const countByStatus = (entries) =>
            entries.reduce((acc, item) => {
                const key = item.status || 'Necunoscut';
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});

        const cereriStats = countByStatus(cereri);
        const adeverinteStats = countByStatus(adeverinte);

        return res.json({
            cereri: cereriStats,
            adeverinte: adeverinteStats
        });
    } catch (err) {
        console.error("Eroare la getDistribuireStatusuri:", err);
        res.status(500).json({ error: "Eroare la încărcarea distribuției pe statusuri" });
    }
};

const getTimpMediuProcesare = async (req, res) => {
    try {
        const { program_studiu, an_studiu, forma_finantare, facultate } = req.query;

        const filters = {};
        if (program_studiu) filters.program_studiu = program_studiu;
        if (an_studiu) filters.an_studiu = an_studiu;
        if (forma_finantare) filters.forma_finantare = forma_finantare;
        if (facultate) filters.facultate = facultate;

        const cereriAprobate = await Solicitari_Cereri.findAll({
            attributes: ['createdAt', 'updatedAt'],
            where: {
                status: 'Aprobata'
            },
            include: {
                model: Users,
                attributes: [],
                where: filters
            }
        });

        if (!cereriAprobate.length) {
            return res.json({ timpMediuZile: 0, timpMediuOre: 0 });
        }

        const durate = cereriAprobate.map(c => {
            const created = new Date(c.createdAt);
            const updated = new Date(c.updatedAt);
            const diff = updated - created;
            return {
                zile: diff / (1000 * 60 * 60 * 24),
                ore: diff / (1000 * 60 * 60),
            };
        });

        const medieZile = (durate.reduce((s, d) => s + d.zile, 0) / durate.length).toFixed(2);
        const medieOre = (durate.reduce((s, d) => s + d.ore, 0) / durate.length).toFixed(2);

        res.json({
            timpMediuZile: parseFloat(medieZile),
            timpMediuOre: parseFloat(medieOre)
        });
    } catch (err) {
        console.error("Eroare la getTimpMediuProcesare:", err);
        res.status(500).json({ error: "Eroare la procesarea timpului mediu" });
    }
};

const getDistribuireAnProgram = async (req, res) => {
    try {
        const { program_studiu } = req.query;

        const userWhere = {
            ...(program_studiu && { program_studiu })
        };

        const cereri = await Solicitari_Cereri.findAll({
            attributes: ['userId'],
            include: {
                model: Users,
                attributes: ['program_studiu', 'an_studiu'],
                where: userWhere
            }
        });

        const distributie = {};
        cereri.forEach(({ User }) => {
            if (!User) return;
            const an = User.an_studiu;
            const program = User.program_studiu;
            const key = `${program} - Anul ${an}`;
            distributie[key] = (distributie[key] || 0) + 1;
        });

        const result = Object.entries(distributie).map(([label, count]) => ({
            categorie: label,
            cereri: count
        }));

        res.json(result);
    } catch (err) {
        console.error("Eroare la getDistribuireAnProgram:", err);
        res.status(500).json({ error: "Eroare la generarea distribuției pe an și program" });
    }
};

const getEvolutieCereri = async (req, res) => {
    try {
        const { program_studiu, an_studiu, facultate, forma_finantare, tip } = req.query;

        const filters = {};
        if (program_studiu) filters.program_studiu = program_studiu;
        if (an_studiu) filters.an_studiu = an_studiu;
        if (facultate) filters.facultate = facultate;
        if (forma_finantare) filters.forma_finantare = forma_finantare;

        const studenti = await Users.findAll({
            where: { ...filters, type: "student" },
            attributes: ["userId"]
        });

        const userIds = studenti.map(s => s.userId);
        if (!userIds.length) return res.json([]);

        let entries;
        if (tip === "adeverinte") {
            entries = await Solicitari_Adeverinte.findAll({
                where: { userId: { [Op.in]: userIds } },
                attributes: ["createdAt"]
            });
        } else {
            // Default: cereri
            entries = await Solicitari_Cereri.findAll({
                where: { userId: { [Op.in]: userIds } },
                attributes: ["createdAt"]
            });
        }

        const grupareLunara = {};
        entries.forEach(e => {
            const data = new Date(e.createdAt);
            const luna = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
            grupareLunara[luna] = (grupareLunara[luna] || 0) + 1;
        });

        const rezultat = Object.entries(grupareLunara)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([luna, valoare]) => ({
                luna,
                valoare
            }));

        res.json(rezultat);
    } catch (err) {
        console.error("Eroare la getEvolutieCereri:", err);
        res.status(500).json({ error: "Eroare la încărcarea evoluției" });
    }
};



module.exports = {
    getStatisticiGenerale,
    getDistribuireStatusuri,
    getTimpMediuProcesare,
    getDistribuireAnProgram,
    getEvolutieCereri
};
