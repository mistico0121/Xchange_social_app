'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal = sequelize.define('deal', {
    date: DataTypes.DATE
  }, {});
  deal.associate = function(models) {
    // associations can be defined here
    deal.belongsTo(models.user);
    deal.belongsTo(models.publication);
    deal.hasMany(models.chatMessage);

  };
  return deal;
};
