module.exports = (sequelize, DataTypes) => {
  const Documente_Solicitari = sequelize.define('Documente_Solicitari', {
    id_document: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_solicitare: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Solicitari_cereri',
        key: 'id_solicitare'
      },
      onDelete: 'CASCADE'
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userId'
    },
    onDelete: 'CASCADE'
  },
    destinatar: {
    type: DataTypes.INTEGER
  }
  }, {
  tableName: 'documente_solicitari'
});

return Documente_Solicitari;
}
