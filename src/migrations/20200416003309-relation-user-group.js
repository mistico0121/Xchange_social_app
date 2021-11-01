module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'userGroups',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        groupId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      }
    );

},

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('userGroups');
  },
};
