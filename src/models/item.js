'use strict';
module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define('item', {
    title: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {});
  item.associate = function(models) {
    // associations can be defined here
    item.belongsTo(models.user);
    item.belongsTo(models.publication);

  };
  return item;
};
