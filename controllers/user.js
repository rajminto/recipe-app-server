// Sequelize models
const db = require('../models')
const User = db.user
const Tag = db.tag

const getUserRecipes = (req, res, next) => {
  const userId = req.params.id
  // Find all recipes the requested user has created OR saved
  User.findByPk(userId)
    .then((user) => {
      if (!user)
        res.status(404).json({
          success: false,
          message: 'User not found. Please try again.',
        })
      else {
        return user.getRecipes({
          include: [
            {
              model: Tag,
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
          order: [['id', 'ASC']],
        })
      }
    })
    .then((recipes) => {
      recipes.length
        ? res.json({ recipes })
        : res.status(404).json({
            success: false,
            message: 'No recipes found for that user. Please try again.',
            recipes: [],
          })
    })
    .catch(next)
}

module.exports = {
  getUserRecipes,
}
