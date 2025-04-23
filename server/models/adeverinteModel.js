module.exports = (sequelize, DataTypes) => {
    const Adeverinte = sequelize.define("Adeverinte", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        tip_adeverinta: {
            type: DataTypes.STRING(255),
            allowNull: false 
        },
        id_student: {
            type: DataTypes.INTEGER,
        },
        nume_student:{
            type: DataTypes.STRING(255),
            // allowNull: false 
        },
        status:{
            type: DataTypes.STRING(255),
            // allowNull: false 
        },
        mime_type:{
            type: DataTypes.STRING(100),
        },
        file_data: {
            type: DataTypes.BLOB("long"), // Echivalent pentru LONGBLOB
        },
    }, {
        tableName: 'adeverinte'
    });

    return Adeverinte;
};