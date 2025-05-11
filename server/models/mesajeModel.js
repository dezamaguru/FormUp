module.exports = (sequelize, DataTypes) => {
    const Mesaje = sequelize.define("Mesaje", {
        id_mesaj: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        id_conversatie: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Conversatii', 
                key: 'id_conversatie'
            },
            onDelete: 'CASCADE'
        },
        id_expeditor: {
            type: DataTypes.INTEGER,
            //allowNull: false
        },
        type:{
            type: DataTypes.ENUM('student', 'admin', 'secretar'),
            //allowNull: false
        },
        continut: {
            type: DataTypes.TEXT,
            //allowNull: false 
        }
    }, {
        tableName: 'mesaje' // Specifică explicit numele tabelului
    });

    return Mesaje;
};