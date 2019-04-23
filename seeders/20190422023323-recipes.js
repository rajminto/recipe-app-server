'use strict'

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
    return queryInterface.bulkInsert('recipes', [
      {
        name: 'Delicious Chili',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        img_url: 'https://placehold.it/600x400',
        prep_time: '20 minutes',
        cook_time: '1 hour',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
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
    return queryInterface.bulkDelete('recipes', null, {})
  }
}
