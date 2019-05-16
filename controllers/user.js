// Sequelize models
const User = require('../models').user

const getUserRecipes = (req, res, next) => {
  res.json({ id: req.params.id, message: 'hello from users'})
}

module.exports = {
  getUserRecipes
}