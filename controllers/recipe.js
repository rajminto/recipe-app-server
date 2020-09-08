// Validation helpers
const {
  validRecipe,
  validIngredients,
  validInstructions,
} = require('../lib/validation/recipe')

// Sequelize models
const db = require('../models')
const Recipe = db.recipe
const User = db.user
const Ingredient = db.ingredient
const Instruction = db.instruction
const Tag = db.tag

const getAllRecipes = (req, res, next) => {
  const { offset, limit, type, query } = req.query

  if (type === 'ingredient') {
    getRecipesByIngredient(offset, limit, query)
      .then((recipes) => {
        recipes.length
          ? res.json({ success: true, recipes })
          : res
              .status(404)
              .json({ success: false, message: 'No recipes found.', recipes })
      })
      .catch(next)
  } else {
    Recipe.findAllRecipesPaginated(offset, limit)
      .then((recipes) => {
        recipes.length
          ? res.json({ success: true, recipes })
          : res
              .status(404)
              .json({ success: false, message: 'No recipes found.', recipes })
      })
      .catch(next)
  }
}

const getRecipeById = (req, res, next) => {
  // TODO: Refactor into models/recipe.js
  Recipe.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['id', 'name'],
        through: { where: { createdBy: true }, attributes: [] },
      },
      { model: Ingredient, attributes: ['id', 'name'] },
      { model: Instruction, attributes: ['id', 'description', 'order'] },
      { model: Tag, attributes: ['id', 'name'], through: { attributes: [] } },
    ],
    order: [
      ['id', 'ASC'],
      [Instruction, 'order', 'ASC'],
      [Ingredient, 'id', 'ASC'],
    ],
  })
    .then((recipe) => {
      recipe
        ? res.json({ success: true, recipe })
        : res.status(404).json({
            success: false,
            message: 'Recipe not found. Please enter a valid ID.',
          })
    })
    .catch(next)
}

const createRecipe = (req, res, next) => {
  const recipe = req.body
  const { id: userId } = req.user
  // TODO: Refactor into models/recipe.js
  // Validate recipe
  if (!validRecipe(recipe))
    res.status(400).json({
      success: false,
      message: 'Please enter a name, description, prep time, and cook time.',
    })
  else if (!validIngredients(recipe.ingredients))
    res.status(400).json({
      success: false,
      message: 'Please enter at least one ingredient with a name and quantity.',
    })
  else if (!validInstructions(recipe.instructions))
    res.status(400).json({
      success: false,
      message: 'Please enter at least one instruction with a description.',
    })
  else {
    // Create recipe once passed validation
    db.sequelize
      .transaction(async (t) => {
        // Using async/await so that newRecipe can be returned on success
        const newRecipe = await Recipe.create(createRecipeObject(recipe), {
          include: [{ model: Ingredient }, { model: Instruction }],
          transaction: t,
        })

        // associate created recipe with logged in user
        await newRecipe.addUser(userId, {
          through: { createdBy: true },
          transaction: t,
        })

        // associate created recipe with correct tags (cannot be done with .create using sequelize)
        const tagIds = mapTagNamesIntoIds(recipe.tags)
        await newRecipe.addTags(tagIds, {
          transaction: t,
        })

        return newRecipe
      })
      .then((newRecipe) => {
        // All requests succeeded: transaction committed
        res.status(201).json({
          success: true,
          message: 'Created new recipe.',
          recipe: newRecipe,
        })
      })
      .catch(next)
    // At least one request failed: transaction rolled back
    // TODO: custom error handling
  }
}

const deleteRecipeById = (req, res, next) => {
  Recipe.destroy({
    where: { id: req.params.id },
  })
    .then((deletedRecipe) => {
      deletedRecipe
        ? res.json({ message: 'Recipe deleted.' })
        : res
            .status(400)
            .json({ message: 'Recipe not found. Please try again.' })
    })
    .catch(next)
}

// --------------------------------------------------------

const updateRecipeById = (req, res, next) => {
  const { tags } = req.body
  const { id: recipeId } = req.params

  db.sequelize
    .transaction(async (t) => {
      const recipeToUpdate = await Recipe.findByPk(recipeId, { transaction: t })

      // update tag associations (replacing previous)
      const updatedRecipe = recipeToUpdate.setTags([1], {
        transaction: t,
      })
      return updatedRecipe
    })
    .then((something) => {
      res.json({ something })
    })
}

// --------------------------------------------------------

const updateRecipeByIdOld = (req, res, next) => {
  // TODO: add validation
  const { ingredients, instructions, tags } = req.body
  const recipeId = req.params.id

  // TODO: Refactor into models/recipe.js
  // Initialize sequelize transaction to execute multiple queries as atomic operation
  db.sequelize
    .transaction((t) => {
      // Create all db requests as promises
      const recipeUpdate = updateRecipePromise(Recipe, req.body, recipeId, t)
      const ingredientUpserts = belongsToRecipeUpserts(
        Ingredient,
        ingredients,
        recipeId,
        t
      )
      const instructionUpserts = belongsToRecipeUpserts(
        Instruction,
        instructions,
        recipeId,
        t
      )
      const tagUpserts = belongsToManyRecipeUpserts(Tag, tags, recipeId, t)

      // Execute all db requests
      return Promise.all([
        recipeUpdate,
        ...ingredientUpserts,
        ...instructionUpserts,
        ...tagUpserts,
      ])
    })
    .then((responses) => {
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

  // TODO: Refactor into models/recipe.js
  Recipe.findAll({
    include: [
      { model: User, attributes: ['id', 'name'] },
      {
        model: Ingredient,
        attributes: ['id', 'name'],
        where: { name: { [Op.iLike]: `%${ingredient}%` } },
      },
    ],
    order: [
      ['id', 'ASC'],
      [Ingredient, 'id', 'ASC'],
    ],
  })
    .then((recipes) => res.json({ recipes }))
    .catch(next)
}

// ------------------------------ GET ALL Recipe Helpers ------------------------------

// TODO: Refactor into models/recipe.js
function getRecipesByIngredient(offset = 0, limit = 20, ingredient) {
  const Op = db.Sequelize.Op

  return Recipe.findAll({
    include: [
      { model: Tag, attributes: ['id', 'name'] },
      {
        model: Ingredient,
        attributes: ['id', 'name'],
        where: { name: { [Op.iLike]: `%${ingredient}%` } },
      },
    ],
    order: [
      ['id', 'ASC'],
      [Ingredient, 'id', 'ASC'],
    ],
    offset: offset,
    limit: limit,
  })
}

// ------------------------------ Create Recipe Helpers ------------------------------

function createRecipeObject({
  name,
  description,
  img_url,
  prep_time,
  cook_time,
  isPrivate,
  ingredients,
  instructions,
  tags,
}) {
  return {
    name,
    description,
    img_url,
    prep_time,
    cook_time,
    isPrivate,
    ingredients,
    instructions,
    tags,
  }
}

function mapTagNamesIntoIds(tagNames) {
  return tagNames.map((tag) => {
    let tagId
    switch (tag) {
      case 'contains-poultry':
        tagId = 1
        break
      case 'contains-fish':
        tagId = 2
        break
      case 'contains-dairy':
        tagId = 3
        break
      case 'contains-meat':
        tagId = 4
        break
      case 'vegetarian':
        tagId = 5
        break
      case 'contains-gluten':
        tagId = 6
        break
      case 'contains-poultry':
        tagId = 7
        break
      case 'contains-fish':
        tagId = 8
        break
      case 'contains-dairy':
        tagId = 9
        break
      default:
        break
    }

    return tagId
  })
}

// ------------------------------ Update Recipe Helpers ------------------------------

function updateRecipePromise(Model, data, recipeId, transaction) {
  return Model.update(data, {
    where: { id: recipeId },
    transaction: transaction,
  })
}

function belongsToRecipeUpserts(Model, records, recipeId, transaction) {
  // Turn records into upsert db promise requests
  return records.map((record) => {
    // Associate each record with recipe
    record.recipeId = recipeId
    return Model.upsert(record, { transaction: transaction })
  })
}

function belongsToManyRecipeUpserts(Model, records, recipeId, transaction) {
  // Turn records into upsert db promise requests
  return records.map((record) => {
    return Model.upsert(record, {
      returning: true,
      transaction: transaction,
    }).then((upserted) => {
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
  searchRecipesByIngredient,
}
