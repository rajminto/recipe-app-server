// Sequelize models
const db = require('../models')
const Recipe = db.recipe
const User = db.user
const Tag = db.tag


const getUserRecipes = (req, res, next) => {
  const userId = req.params.id
  // Find all recipes the requested user has created OR saved
  Recipe.findAll({
    include: [
      { model: User, attributes: ['id', 'name'], through: { where: { userId: userId }, attributes: ['createdBy'] } },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
    ],
    order: [
      ['id', 'ASC']
    ]
  })
    .then(recipes => {
      res.json({ recipes })
    })
}

module.exports = {
  getUserRecipes
}