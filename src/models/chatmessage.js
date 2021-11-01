'use strict';
module.exports = (sequelize, DataTypes) => {
  const chatMessage = sequelize.define('chatMessage', {
    message: DataTypes.STRING
  }, {});
  chatMessage.associate = function(models) {
    // associations can be defined here
    chatMessage.belongsTo(models.user);
    chatMessage.belongsTo(models.deal);

  };
  return chatMessage;
};
