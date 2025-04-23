module.exports = (sequelize, DataTypes) =>{

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
            allowNull: false
        },
        an_studiu: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        grupa: {
            type: DataTypes.STRING,
        },
        forma_finantare: {
            type: DataTypes.ENUM('buget', 'taxa', 'null'),
//allowNull: false
            //allowNull: false
        },
        forma_invatamant: {
            type: DataTypes.ENUM('IF', 'ID'//allowNull: false
, 'null'),
            //allowNull: alse
        }
    })

    return Users;
};