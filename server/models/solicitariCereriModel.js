const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Solicitari_Cereri = sequelize.define('Solicitari_Cereri', {
        id_solicitare: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        id_cerere: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Cereri', // Numele tabelului asociat
                key: 'id_cerere'
            },
            onDelete: 'CASCADE' // Șterge solicitările dacă cererea este ștearsă
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Numele tabelului asociat
                key: 'userId'
            },
            onDelete: 'CASCADE' // Șterge solicitările dacă utilizatorul este ștearsă
        },
        status:{
            type: DataTypes.ENUM('Trimisa', 'Procesare','Aprobata', 'Respinsa'),
            allowNull: false 
        },
        mime_type:{
            type: DataTypes.STRING(100),
            //allowNull: false 
        },
        file_name: {
            type: DataTypes.STRING(255),
            //allowNull: false
        },
        file_data: {
            type: DataTypes.BLOB("long"), // Echivalent pentru LONGBLOB
            //allowNull: false 
        }
    }, {
        tableName: 'Solicitari_cereri'
    });

    return Solicitari_Cereri;
}