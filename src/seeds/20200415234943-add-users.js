'use strict';

const bcrypt = require('bcrypt');
const faker = require('faker');
//const Sequelize = require('sequelize');
const db = require('../models');
const Condition = db.Condition;

const PASSWORD_SALT = 10;


module.exports = {
  up: (queryInterface) => {

    const usersData = [
      {
        is_admin: false,
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        username: faker.internet.userName(),
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  
};

/*
function generateFakeUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const newUser = {
      is_admin: false,
      email: faker.internet.email(),
      name: faker.name.findName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      phone: faker.phone.phoneNumber(),
      address: faker.address.streetAddress()
    };
    users.push(newUser);
  }
  return users;
}
*/