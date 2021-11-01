module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'image_url',
      {
        type: Sequelize.STRING
      }
    ).then(() => { // reviews publicationid
      return queryInterface.addColumn(
        'groups',
        'image_url',
        {
          type: Sequelize.STRING,
        }
      );
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

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
