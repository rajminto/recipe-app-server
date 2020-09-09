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
        through: {
          where: { createdBy: true },
          attributes: ['createdBy', 'isFavorite'],
        },
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

        // associate created recipe with logged in user as creator
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

const updateRecipeById = async (req, res, next) => {
  const { ingredients, instructions, tags } = req.body
  const { id: recipeId } = req.params

  try {
    const result = await db.sequelize.transaction(async (t) => {
      const recipe = await Recipe.findByPk(recipeId, { transaction: t })

      // update basic recipe info
      await recipe.update(req.body, { transaction: t })

      // reset recipe ingredient associations
      await recipe.setIngredients([], { transaction: t })

      // associate new ingredients with recipe
      const newIngredients = ingredients.map((ingredient) => {
        ingredient.recipeId = recipeId
        return ingredient
      })

      // create new ingredients
      await Ingredient.bulkCreate(newIngredients, { transaction: t })

      // reset recipe instruction associations
      await recipe.setInstructions([])

      // associate new instructions wth recipe
      const newInstructions = instructions.map((instruction) => {
        instruction.recipeId = recipeId
        return instruction
      })

      // create new instructions
      await Instruction.bulkCreate(newInstructions, { transaction: t })

      // update tag associations (replacing previous)
      const tagIds = mapTagNamesIntoIds(tags)
      await recipe.setTags(tagIds, { transaction: t })

      return recipe
    })

    // transaction succeeded, respond to client
    res.status(200).json({
      success: true,
      message: 'Recipe updated successfully!',
      recipe: result,
    })
  } catch (err) {
    // at least one request failed, transaction rolled back
    next(err)
  }
}

const updateRecipeSaveCount = async (req, res, next) => {
  try {
    const { id: recipeId } = req.params
    const { id: userId } = req.user

    const recipe = await Recipe.findByPk(recipeId, {
      include: {
        model: User,
        attributes: ['id', 'name'],
        through: { attributes: ['createdBy'] },
      },
    })

    // check if user has created this recipe
    const createdBy = recipe.users.some(
      (user) => user.id === userId && user.userRecipes.createdBy === true
    )

    // check if user has already saved recipe
    const alreadySaved = recipe.users.some((user) => user.id === userId)

    if (!alreadySaved) {
      // create association between current user and recipe
      const addUser = await recipe.addUser(req.user.id)

      // increment recipe saveCount field
      const increment = await recipe.increment('saveCount')
      res.json({
        status: 'changed',
        createdBy,
        alreadySaved,
        recipe,
      })
    } else {
      res.json({
        status: 'unchanged',
        createdBy,
        alreadySaved,
        recipe,
      })
    }
  } catch (err) {
    next(err)
  }
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
  updateRecipeSaveCount,
  searchRecipesByIngredient,
}
