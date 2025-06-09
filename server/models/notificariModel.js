module.exports = (sequelize, DataTypes) => {
  const Notificari = sequelize.define('Notificari', {
    id_notificare: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    titlu: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mesaj: {
      type: DataTypes.TEXT
    },
    link_destinatie: {
      type: DataTypes.STRING
    },
    citita: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'notificari',
    timestamps: true,
    createdAt: 'creat_la',
    updatedAt: false
  });

  return Notificari;
}
