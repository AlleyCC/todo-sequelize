'use strict';
const bcrypt = require('bcryptjs');
const todo = require('../models/todo');
const SEED_USER= {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
      .then(userId => {
        queryInterface.bulkInsert('Todos',
          Array.from({length: 10}).map((_, i) => 
          ({
            name: `name-${i}`,
            UserId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        ),{})
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Todo', null, {})
      .then(() => queryInterface('User', null, {}))
  }
};
