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
      'tags',
      [
        {
          name: 'italian',
          img_url: 'https://placehold.it/200x200',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'comfort-food',
          img_url: 'https://placehold.it/200x200',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'hot',
          img_url: 'https://placehold.it/200x200',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'healthy',
          img_url: 'https://placehold.it/200x200',
          createdAt: new Date(),
          updatedAt: new Date(),
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
    return queryInterface.bulkDelete('tags', null, {})
  },
}
