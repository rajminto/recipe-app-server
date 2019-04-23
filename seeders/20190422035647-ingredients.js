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
        name: 'cloves of garlic',
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'tablespoons of olive oil',
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'large white onions',
        quantity: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'pound of ground beef',
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'cans of cannellini',
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'can of red kidney beans',
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'cans of pinto beans',
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'small can of tomato paste',
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipeId: 1
      }, {
        name: 'cans of diced tomatoes',
        quantity: 2,
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
