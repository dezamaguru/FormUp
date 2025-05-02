module.exports = (sequelize, DataTypes) => {
    const Observatii_Cereri = sequelize.define('Observatii_Cereri', {
        id_observatie: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        id_solicitare: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Solicitari_Cereri',
                key: 'id_solicitare'
            }
        },
        id_student: {
            type: DataTypes.INTEGER,
            //allowNull: false
        },
        id_secretar:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        titlu:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        continut:{
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{
        tableName: 'Observatii_Cereri'
    });

    return Observatii_Cereri;
}