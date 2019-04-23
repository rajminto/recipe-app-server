const express = require('express')
const router = express.Router()

const controller = require('../controllers/recipe')

router.get('/', controller.getAllRecipes)
router.get('/:id', controller.getRecipeById)
router.post('/', controller.createRecipe)

module.exports = router