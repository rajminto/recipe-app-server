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
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/8d3k/128.jpg',
        bio: '+1 tbh echo park, knausgaard blue bottle humblebrag fanny pack. Literally cloud bread 90\'s vegan tattooed synth sriracha tofu whatever biodiesel bespoke + 1 sustainable pug.Ramps flannel sartorial sustainable hexagon dreamcatcher.XOXO viral fanny pack literally post - ironic helvetica biodiesel lyft DIY.Post - ironic kitsch yr, offal retro fanny pack lumbersexual dreamcatcher scenester pop - up austin swag subway tile.',
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: 'Ross',
        email: 'ross@gmail.com',
        password: bcrypt.hashSync(process.env.ROSS_PW, saltRounds),
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/8d3k/128.jpg',
        bio: 'Lo-fi scenester health goth narwhal, shoreditch jean shorts franzen yuccie selvage yr poke enamel pin kitsch stumptown. Vegan keytar farm-to-table photo booth +1 raclette actually polaroid jianbing. Disrupt vinyl poke locavore cloud bread blog. Synth cloud bread fingerstache, swag freegan la croix pitchfork tilde. Locavore kickstarter try-hard pinterest.',
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
