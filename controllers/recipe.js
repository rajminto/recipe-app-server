// Validation helpers
const { validRecipe, validIngredients, validInstructions } = require('../lib/validation/recipe')

// Sequelize models
const db          = require('../models')
const Recipe      = db.recipe
const User        = db.user
const Ingredient  = db.ingredient
const Instruction = db.instruction 
const Tag         = db.tag


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

  // Initialize sequelize transaction to execute multiple queries as atomic operation
  db.sequelize.transaction(t => {
    // Create all db requests as promises
    const recipeUpdate        = updateRecipePromise(Recipe, req.body, recipeId, t)
    const ingredientUpserts   = belongsToRecipeUpserts(Ingredient, ingredients, recipeId, t)
    const instructionUpserts  = belongsToRecipeUpserts(Instruction, instructions, recipeId, t)
    const tagUpserts          = belongsToManyRecipeUpserts(Tag, tags, recipeId, t)

    // Execute all db requests
    return Promise
      .all([
        recipeUpdate,
        ...ingredientUpserts,
        ...instructionUpserts,
        ...tagUpserts
      ])
  })
    .then(() => {
      // All requests succeeded: transaction committed
      res.json({ message: 'Recipe updated.' })
    })
    .catch(next)
    // At least one request failed: transaction rolled back
    // TODO: custom error handling
}

// ------------------------------ Create Recipe Helpers ------------------------------

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

// ------------------------------ Update Recipe Helpers ------------------------------

function updateRecipePromise(model, data, id, transaction) {
  return model.update(data, { where: { id: id } , transaction: transaction })
}

function belongsToRecipeUpserts(Model, records, recipeId, transaction) {
  // Turn records into upsert db promise requests
  return records.map(record => {
    // Associate each record with recipe
    record.recipeId = recipeId
    return Model.upsert(record, { transaction: transaction })
  })
}

function belongsToManyRecipeUpserts(Model, records, recipeId, transaction) {
  // Turn records into upsert db promise requests
  return records.map(record => {
    return Model.upsert(record, { returning: true, transaction: transaction })
      .then(upserted => {
        const instance = upserted[0]
        // Once records have been upserted, ensure they are associated with recipe
        // Creates records in join table
        return instance.addRecipe(recipeId, { transaction: transaction })
      })
  })
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipeById,
  updateRecipeById
}