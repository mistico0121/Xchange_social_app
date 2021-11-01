'use strict';

module.exports = {
  up: (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    const publicationsData = [
      {
        title: "Zapatillas",
        category: "Vestuario",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        state: "Abierta",
        createdAt: new Date(),
        updatedAt: new Date(),

        
      },
      {
        title: "Juego PS3",
        category: "Videojuegos",
        description: "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
        state: "Abierta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Pelota",
        category: "Deportes",
        description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
        state: "Abierta",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

  return queryInterface.bulkInsert("publications", publicationsData);
},

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete("publications",null, {}),
};
