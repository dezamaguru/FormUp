module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('student', 'admin', 'secretar'),
            allowNull: false
        },
        program_studiu: {
            type: DataTypes.ENUM('licenta', 'master'),
        },
        an_studiu: {
            type: DataTypes.INTEGER,
        },
        grupa: {
            type: DataTypes.STRING,
        },
        forma_finantare: {
            type: DataTypes.ENUM('buget', 'taxa', 'null'),
        },
        forma_invatamant: {
            type: DataTypes.ENUM('IF', 'ID', 'null'),
        },
        facultate: {
            type: DataTypes.ENUM('Informatica Economica EN', 'Informatica Economica', 'Statistica', 'Cibernetica'),
        },
        fcmToken: {
            type: DataTypes.STRING,
        }

    })

    return Users;
};