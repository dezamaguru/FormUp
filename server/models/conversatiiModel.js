module.exports = (sequelize, DataTypes) => {
    const Conversatii = sequelize.define("Conversatii", {
        id_conversatie: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'userId'
            },
            onDelete: 'CASCADE'
        },
        program_studiu: {
            type: DataTypes.ENUM('licenta', 'master'),
            allowNull: false
        },
        an_studiu: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_student: {
            type: DataTypes.INTEGER,
            //allowNull: false
        },
        id_secretar: {
            type: DataTypes.INTEGER,
            //allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        tableName: 'conversatii'
    });

    return Conversatii;
};