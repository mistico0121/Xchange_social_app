'use strict';
module.exports = (sequelize, DataTypes) => {
  const group = sequelize.define('group', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    image_url: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  group.associate = function(models) {
    // associations can be defined here
    group.belongsToMany(models.user, { through: 'userGroup' });
    group.hasMany(models.publication, { onDelete: 'CASCADE' });

  };
  return group;
};
