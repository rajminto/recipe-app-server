const express = require('express')
const router = express.Router()

// TODO: protect POST, PUT, DELETE routes (only )
const controller = require('../controllers/user')

router.get('/:id/recipes', controller.getUserRecipes)

module.exports = router