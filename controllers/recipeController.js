const models = require('../models')
// TODO: Use only relevant models?
  // Is possible?
  // More performant?

const getAllRecipes = (req, res, next) => {
  models.recipe.findAll({
    // TODO: only return selected attributes
      // EX. user.name
    include: [
      { model: models.user },
      'ingredients',
      'instructions',
      'tags'
    ]
  })
    .then(recipes => {
      res.json({ recipes })
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ message: 'Something went wrong...' })
    })
}

const getRecipeById = (req, res, next) => {
  models.recipe.findByPk(req.params.id, {
    // TODO: only return selected attributes
      // EX. user.name
    include: [
      { model: models.user },
      'ingredients',
      'instructions',
      'tags'
    ]
  })
    .then(recipe => {
      recipe
        ? res.json({ recipe })
        : res.status(400).json({ message: 'Recipe not found. Please try again.' })
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ message: 'Something went wrong...' })
    })
}

module.exports = {
  getAllRecipes,
  getRecipeById
}