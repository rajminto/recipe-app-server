// Sequelize models
const Recipe = require('../models').recipe
const User = require('../models').user
const Ingredient = require('../models').ingredient
const Instruction = require('../models').instruction
const Tag = require('../models').tag

const getAllRecipes = (req, res, next) => {
  Recipe.findAll({
    include: [
      { model: User, attributes: ['name'] },
      { model: Ingredient, attributes: ['name', 'quantity'] },
      { model: Instruction, attributes: ['description', 'order'] },
      { model: Tag, attributes: ['name'], through: { attributes: [] } }
    ],
    order: [
      [Instruction, 'order', 'ASC']
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
  Recipe.findByPk(req.params.id, {
    include: [
      { model: User, attributes: ['name'] },
      { model: Ingredient, attributes: ['name', 'quantity'] },
      { model: Instruction, attributes: ['description', 'order'] },
      { model: Tag, attributes: ['name'], through: { attributes: [] } }
    ],
    order: [
      [Instruction, 'order', 'ASC']
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