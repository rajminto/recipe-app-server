const express = require('express')
const router = express.Router()

const recipes = require('../controllers/recipeController')

router.get('/', recipes.getAllRecipes)

router.get('/:id', recipes.getRecipeById)

module.exports = router