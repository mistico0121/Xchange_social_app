'use strict';
module.exports = (sequelize, DataTypes) => {
  const ofertacomment = sequelize.define('ofertacomment', {
    comment_text: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    ofertumId: DataTypes.INTEGER
  }, {});
  ofertacomment.associate = function(models) {
    ofertacomment.belongsTo(models.user);
    ofertacomment.belongsTo(models.oferta, { onDelete: 'CASCADE' });

  };
  return ofertacomment;
};