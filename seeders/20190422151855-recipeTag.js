'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('recipeTags', [
      {
        recipeId: 1,
        tagId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        recipeId: 1,
        tagId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        recipeId: 1,
        tagId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        recipeId: 1,
        tagId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
