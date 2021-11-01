'use strict';
module.exports = (sequelize, DataTypes) => {
  const publications = sequelize.define('publication', {
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    description: DataTypes.STRING,
    state: DataTypes.STRING,
    image_url: DataTypes.STRING,
  }, {});
  publications.associate = function(models) {
    // associations can be defined here
    publications.belongsTo(models.user);
    publications.belongsTo(models.group, { onDelete: 'CASCADE' });
    publications.hasMany(models.deal);
    publications.hasMany(models.comment, { onDelete: 'CASCADE' });
    publications.hasMany(models.review);
    publications.hasMany(models.item);
    publications.hasMany(models.oferta, { onDelete: 'CASCADE' });
  };
  return publications;
};
