module.exports = (sequelize, DataTypes) => {
    const Cereri = sequelize.define("Cereri", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false 
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: false 
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_data: {
            type: DataTypes.BLOB("long"), // Echivalent pentru LONGBLOB
            allowNull: false 
        },
        uploaded_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW 
        }
    }, {
        tableName: 'cereri' // Specifică explicit numele tabelului
    });

    return Cereri;
};