// Validation helpers
const { validRecipe, validIngredients, validInstructions } = require('../lib/validation/recipe')

// Sequelize models
const Recipe      = require('../models').recipe
const User        = require('../models').user
const Ingredient  = require('../models').ingredient
const Instruction = require('../models').instruction
const Tag         = require('../models').tag

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
    .then(recipes => res.json({ recipes }))
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
  if (!validRecipe(recipe))                         res.status(400).json({ message: 'Please enter a name, description, prep time, and cook time.' })
  else if (!validIngredients(recipe.ingredients))   res.status(400).json({ message: 'Please enter at least one ingredient with a name and quantity.' })
  else if (!validInstructions(recipe.instructions)) res.status(400).json({ message: 'Please enter at least one instruction with a description.' })
  else {
    // Create recipe once passed validation
    Recipe.create(createRecipeObject(recipe), {
      include: [
        { model: Ingredient },
        { model: Instruction },
        { model: Tag }
      ]
    })
      .then(newRecipe => res.status(201).json({ message: 'Created new recipe.', recipe: newRecipe }))
      .catch(next)
  }
}

// ------------------------------ Helper Functions ------------------------------

function createRecipeObject({ name, description, prep_time, cook_time, ingredients, instructions, tags, userId }) {
  return {
    name,
    description,
    prep_time,
    cook_time,
    userId,
    ingredients,
    instructions,
    tags
  }
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe
}