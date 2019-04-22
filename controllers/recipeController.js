const models = require('../models')
// TODO: Use only relevant models?
  // Is possible?
  // More performant?

const getAllRecipes = (req, res, next) => {
  models.recipe.findAll({
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
  // TODO: handle requests for id's not present

  models.recipe.findByPk(req.params.id, {
    include: [
      { model: models.user },
      'ingredients',
      'instructions',
      'tags'
    ]
  })
    .then(recipe => {
      res.json({ recipe })
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