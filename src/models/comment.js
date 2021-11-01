'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    comment_text: DataTypes.STRING
  }, {});
  comment.associate = function(models) {
    // associations can be defined here
    comment.belongsTo(models.user);
    comment.belongsTo(models.publication, { onDelete: 'CASCADE' });
  };
  return comment;
};
