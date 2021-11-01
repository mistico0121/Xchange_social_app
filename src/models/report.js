'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    user_id: DataTypes.INTEGER,
    publication_id: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {});
  report.associate = function(models) {
    // associations can be defined here
  };
  return report;
};