module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn( // reviews userid
      'reviews',
      'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        }
      }
    )
      .then(() => { // reviews publicationid
        return queryInterface.addColumn(
          'reviews',
          'publicationId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'publications',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // Publications userid
        return queryInterface.addColumn(
          'publications',
          'userId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // Publications groupid
        return queryInterface.addColumn(
          'publications',
          'groupId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'groups',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          }
        );
      })
      .then(() => { // item
        return queryInterface.addColumn(
          'items',
          'userId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // item publicationid
        return queryInterface.addColumn(
          'items',
          'publicationId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'publications',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // deal userid
        return queryInterface.addColumn(
          'deals',
          'userId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // deal userid2
        return queryInterface.addColumn(
          'deals',
          'userId2',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // deal publicationid
        return queryInterface.addColumn(
          'deals',
          'publicationId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'publications',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // comments userid
        return queryInterface.addColumn(
          'comments',
          'userId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // comments publicationid
        return queryInterface.addColumn(
          'comments',
          'publicationId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'publications',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          }
        );
      })
      .then(() => { // chatMessages userid
        return queryInterface.addColumn(
          'chatMessages',
          'userId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            }
          }
        );
      })
      .then(() => { // chatMessages dealid
        return queryInterface.addColumn(
          'chatMessages',
          'dealId',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'deals',
              key: 'id',
            }
          }
        );
      });

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'reviews',
      'userId'
    )
      .then(() => {
        return queryInterface.removeColumn(
          'reviews',
          'publicationId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'publications',
          'userId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'publications',
          'groupId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'items',
          'userId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'items',
          'publicationId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'deals',
          'userId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'deals',
          'userId2'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'deals',
          'publicationId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'comments',
          'userId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'comments',
          'publicationId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'chatMessages',
          'userId'
        );
      })
      .then(() => {
        return queryInterface.removeColumn(
          'chatMessages',
          'dealId'
        );
      });
  },
};
