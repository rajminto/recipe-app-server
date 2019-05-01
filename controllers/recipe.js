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
      { model: User, attributes: ['id', 'name'], through: { where: { createdBy: true }, attributes: [] } },
      { model: Ingredient, attributes: ['id', 'name'] },
      { model: Instruction, attributes: ['id', 'description', 'order'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
    ],
    order: [
      ['id', 'ASC'],
      [Instruction, 'order', 'ASC'],
      [Ingredient, 'id', 'ASC']
    ]
  })
    .then(recipes => res.json({ recipes }))
    .catch(next)
}

const getRecipeById = (req, res, next) => {
  Recipe.findByPk(req.params.id, {
    include: [
      { model: User, attributes: ['id', 'name'], through: { where: { createdBy: true }, attributes: [] } },
      { model: Ingredient, attributes: ['id', 'name'] },
      { model: Instruction, attributes: ['id', 'description', 'order'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } }
    ],
    order: [
      ['id', 'ASC'],
      [Instruction, 'order', 'ASC'],
      [Ingredient, 'id', 'ASC']
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
    // TODO: refactor to implement all steps as one transaction
    Recipe.create(createRecipeObject(recipe), {
      include: [
        { model: Ingredient },
        { model: Instruction },
        { model: Tag }
      ]
    })
      .then(newRecipe => {
        // Associate with user who POSTed
        newRecipe.addUser(recipe.userId, { through: { createdBy: true }})
        res.status(201).json({ message: 'Created new recipe.', recipe: newRecipe })
      })
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
    .then(responses => {
      // All requests succeeded: transaction committed
      res.json({ message: 'Recipe updated.', responses: responses })
    })
    .catch(next)
    // At least one request failed: transaction rolled back
    // TODO: custom error handling
}

const searchRecipesByIngredient = (req, res, next) => {
  const ingredient = req.query.ingredient
  const Op = db.Sequelize.Op

  Recipe.findAll({
    include: [
      { model: User, attributes: ['name'] },
      {
        model: Ingredient,
        attributes: ['id', 'name', 'quantity'], 
        where: { name: { [Op.iLike]: `%${ingredient}%` } }
      },
    ],
    order: [
      ['id', 'ASC'],
      [Ingredient, 'id', 'ASC']
    ]
  })
    .then(recipes => res.json({ recipes }))
    .catch(next)
}

// ------------------------------ Create Recipe Helpers ------------------------------

function createRecipeObject({ name, description, prep_time, cook_time, ingredients, instructions, tags }) {
  return {
    name,
    description,
    prep_time,
    cook_time,
    ingredients,
    instructions,
    tags
  }
}

// ------------------------------ Update Recipe Helpers ------------------------------

function updateRecipePromise(Model, data, id, transaction) {
  return Model.update(data, { where: { id: id } , transaction: transaction })
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
        // Record has been upserted
        const instance = upserted[0]
        const isNewRecord = upserted[1]

        // Associate new record with recipe
        return isNewRecord
          ? instance.addRecipe(recipeId, { transaction: transaction })
          : false
      })
  })
}

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipeById,
  updateRecipeById,
  searchRecipesByIngredient
}