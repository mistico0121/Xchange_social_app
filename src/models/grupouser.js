'use strict';
module.exports = (sequelize, DataTypes) => {
  const grupoUser = sequelize.define('grupoUser', {
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {});
  grupoUser.associate = function(models) {
    // associations can be defined here
  };
  return grupoUser;
};