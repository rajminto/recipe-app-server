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
    return queryInterface.bulkInsert('ingredients', [
      {
        name: '3 cloves of garlic',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '2 tablespoons of olive oil',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '3 large white onions',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '1 pound of ground beef',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '2 cans of cannellini',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '1 can of red kidney beans',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '2 cans of pinto beans',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '1 small can of tomato paste',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: '2 cans of diced tomatoes',
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
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
    return queryInterface.bulkDelete('ingredients', null, {})
  }
}
