'use strict';
module.exports = (sequelize, DataTypes) => {
  const oferta = sequelize.define('oferta', {
    userId: DataTypes.INTEGER,
    mensaje: DataTypes.TEXT
  }, {});
  oferta.associate = function(models) {
    oferta.belongsTo(models.publication,{ onDelete: 'CASCADE' });
  };
  return oferta;
};