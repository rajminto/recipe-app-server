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
    return queryInterface.bulkInsert(
      'instructions',
      [
        {
          description: 'Do something',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          recipeId: 1,
        },
        {
          description: 'Do something else',
          order: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          recipeId: 1,
        },
        {
          description: 'Do another thing',
          order: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          recipeId: 1,
        },
        {
          description: 'Keep going',
          order: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          recipeId: 1,
        },
        {
          description: 'Wait a while',
          order: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          recipeId: 1,
        },
        {
          description: 'Finishing touches',
          order: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          recipeId: 1,
        },
      ],
      {}
    )
  },
  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {})
    */
    return queryInterface.bulkDelete('instructions', null, {})
  },
}
