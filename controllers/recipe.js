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

const deleteRecipeById = (req, res, next) => {
  Recipe.destroy({
    where: { id: req.params.id }
  })
    .then(deletedRecipe => {
      deletedRecipe
        ? res.json({ message: 'Recipe deleted.' })
        : res.status(400).json({ message: 'Recipe not found. Please try again.' })
    })
    .catch(next)
}

const updateRecipeById = (req, res, next) => {
  // TODO: add validation
  const { ingredients, instructions, tags } = req.body
  const recipeId = req.params.id

  const recipeUpdate        = generateUpdatePromise(Recipe, req.body, recipeId)
  const ingredientUpserts   = generateBelongsToUpserts(Ingredient, ingredients, recipeId)
  const instructionUpserts  = generateBelongsToUpserts(Instruction, instructions, recipeId)

  // TODO: upsert tags
    // TODO: write to join table
  // const tagUpserts = tags.map(tag => Tag.upsert(tag))
  
  Promise.all([recipeUpdate, ...ingredientUpserts, ...instructionUpserts])
    .then(promises => {
      // console.log(promises)
      res.json({ promises })
    })
    .catch(next)
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

function generateBelongsToUpserts(model, data, userId) {
  return data.map(element => {
    element.recipeId = userId
    console.log(element)
    return model.upsert(element)
  })
}

function generateUpdatePromise(model, data, id) {
  return model.update(data, { where: { id: id } })
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipeById,
  updateRecipeById
}