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
      { model: Ingredient, attributes: ['id', 'name', 'quantity'] },
      { model: Instruction, attributes: ['id', 'description', 'order'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
    ],
    order: [
      [Instruction, 'order', 'ASC']
    ]
  })
    .then(recipes => {
      res.json({ recipes })
    })
    .catch(next)
}

const getRecipeById = (req, res, next) => {
  Recipe.findByPk(req.params.id, {
    include: [
      { model: User, attributes: ['name'] },
      { model: Ingredient, attributes: ['id', 'name', 'quantity'] },
      { model: Instruction, attributes: ['id', 'description', 'order'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
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
    .catch(next)
}

const createRecipe = (req, res, next) => {
  const {
    name,
    description,
    prep_time,
    cook_time,
    userId,
    ingredients,
    instructions,
    tags
  } = req.body

  console.log(req.body.ingredients)
  
  // TODO: add better validation
  if (!name || !description || !prep_time || !cook_time || !userId) {
    res.status(400).json({ message: 'Please enter a name, description, prep time, and cook time.' })
  } else {
  Recipe.create({
    name,
    description,
    prep_time,
    cook_time,
    userId,
    ingredients,
    instructions,
    tags
  }, {
    include: [
      { model: Ingredient },
      { model: Instruction },
      { model: Tag }
    ]
  })
    .then(newRecipe => {
      res.json({ message: 'Created new recipe.', recipe: newRecipe })
    })
    .catch(next)
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe
}