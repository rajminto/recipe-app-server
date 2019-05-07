'use strict'
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {})
    */
    return queryInterface.bulkInsert('users', [
      {
        name: 'Matt',
        email: 'matt@gmail.com',
        password: bcrypt.hashSync(process.env.MATT_PW, saltRounds),
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'Ross',
        email: 'ross@gmail.com',
        password: bcrypt.hashSync(process.env.ROSS_PW, saltRounds),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },
  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {})
    */
    return queryInterface.bulkDelete('users', null, {})
  }
}
