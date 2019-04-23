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
  const recipe = req.body
  // Validate recipe
  if (!validRecipe(recipe)) res.status(400).json({ message: 'Please enter a name, description, prep time, and cook time.' })
  else if (!validIngredients(recipe.ingredients)) res.status(400).json({ message: 'Please enter at least one ingredient with a name and quantity.' })
  else if (!validInstructions(recipe.instructions)) res.status(400).json({ message: 'Please enter at least one instruction with a description.' })
  else {
  // Create recipe once passed validation
  Recipe.create({
    name: recipe.name,
    description: recipe.description,
    prep_time: recipe.prep_time,
    cook_time: recipe.cook_time,
    userId: recipe.userId,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    tags: recipe.tags
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

// ------------------------------ RECIPE VALIDATION HELPERS ------------------------------

function validRecipe({ name, description, prep_time, cook_time, userId }) {
  // Required fields
  const fieldsPresent     = name && description && prep_time && cook_time && userId
  // Data types
  const validName         = typeof name === 'string'
  const validDescription  = typeof description === 'string'
  const validPrep         = typeof prep_time === 'string'
  const validCook         = typeof cook_time === 'string'
  const validUserId       = typeof userId === 'number'

  return fieldsPresent && validName && validDescription && validPrep && validCook && validPrep && validCook && validUserId
}

function validInstructions(instructions) {
  // Check if there are no instructions
  if (instructions.length < 1) return false

  // Validate presence & type
  for (let instruction of instructions) {
    const { description, order } = instruction
    if (!description || !order) return false
    if (typeof description !== 'string' || typeof order !== 'number') return false
  }
  return true
}

function validIngredients(ingredients) {
  // Check if there are no ingredients
  if (ingredients.length < 1) return false

  // Validate presence & type
  for (let ingredient of ingredients) {
    const { name, quantity } = ingredient
    if (!name || !quantity) return false
    if (typeof name !== 'string' || typeof quantity !== 'number') return false
  }
  return true
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe
}