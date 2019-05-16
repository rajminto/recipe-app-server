const express = require('express')
const router = express.Router()

const controller = require('../controllers/user')

router.get('/:id/recipes', controller.getUserRecipes)

module.exports = router