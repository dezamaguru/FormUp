'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Relatiile dintre modele
db.Users.hasMany(db.Solicitari_Adeverinte, { foreignKey: 'userId' });
db.Solicitari_Adeverinte.belongsTo(db.Users, { foreignKey: 'userId' });

db.Users.hasMany(db.Solicitari_Cereri, { foreignKey: 'userId' });
db.Solicitari_Cereri.belongsTo(db.Users, { foreignKey: 'userId' });

db.Cereri.hasMany(db.Solicitari_Cereri, { foreignKey: 'id_cerere' });
db.Solicitari_Cereri.belongsTo(db.Cereri, { foreignKey: 'id_cerere' });

db.Solicitari_Cereri.hasMany(db.Observatii_Cereri, { foreignKey: 'id_solicitare' })
db.Observatii_Cereri.belongsTo(db.Solicitari_Cereri, { foreignKey: 'id_solicitare' })

db.Conversatii.belongsTo(db.Users, { foreignKey: 'userId' })
db.Users.hasMany(db.Conversatii, { foreignKey: 'userId' })

db.Mesaje.belongsTo(db.Conversatii, { foreignKey: 'id_conversatie' })
db.Conversatii.hasMany(db.Mesaje, { foreignKey: 'id_conversatie' })

db.Solicitari_Cereri.hasMany(db.Documente_Solicitari, {foreignKey: 'id_solicitare'});
db.Documente_Solicitari.belongsTo(db.Solicitari_Cereri, {foreignKey: 'id_solicitare'});

module.exports = db;
