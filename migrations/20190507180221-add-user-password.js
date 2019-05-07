'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER })
    */
    return queryInterface.addColumn(
      'users',
      'password',
      { type: Sequelize.STRING, allowNull: false }
    )
  },

  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users')
    */
    return queryInterface.removeColumn('users', 'password')
  }
}