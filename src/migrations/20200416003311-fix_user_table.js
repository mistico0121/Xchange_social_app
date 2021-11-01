'use strict';

module.exports = {
  up: async function(queryInterface, Sequelize){
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    await queryInterface.changeColumn('users', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
      allowNull: false,
    });
    await queryInterface.changeColumn('users', 'updatedAt', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
        allowNull: false,
      });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.dropTable('users');
    */
  }
};