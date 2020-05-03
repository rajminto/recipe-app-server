const express = require('express')
const router = express.Router()

const auth = require('../lib/auth')
const controller = require('../controllers/recipe')

router.get('/', controller.getAllRecipes)
router.get('/search', controller.searchRecipesByIngredient)
router.get('/:id', controller.getRecipeById)
router.post('/', auth.checkAuthenticated, controller.createRecipe)
router.delete('/:id', controller.deleteRecipeById)
router.put('/:id', controller.updateRecipeById)

module.exports = router