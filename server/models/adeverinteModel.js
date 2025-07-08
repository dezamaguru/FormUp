
module.exports = (sequelize, DataTypes) => {
    const Solicitari_Adeverinte = sequelize.define("Solicitari_Adeverinte", {
        id_adeverinta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        tip_adeverinta: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Numele tabelului asociat
                key: 'userId'
            },
            onDelete: 'CASCADE' // Șterge solicitările dacă utilizatorul este șters
        },
        nume_student: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Trimisa', 'Procesare', 'Aprobata', 'Respinsa'),
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(255),
            //allowNull: false
        }
    }, {
        tableName: 'Solicitari_adeverinte'
    });

    return Solicitari_Adeverinte;
};