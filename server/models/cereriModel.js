module.exports = (sequelize, DataTypes) => {
    const Cereri = sequelize.define("Cereri", {
        id_cerere: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('licenta', 'master', 'comun', 'altele'),
            //allowNull: false 
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_path: {
            type: DataTypes.STRING(512),
            allowNull: true
        }
    }, {
        tableName: 'cereri' // Specifică explicit numele tabelului
    });

    return Cereri;
};