const express = require('express')
const router = express.Router()

const controller = require('../controllers/tag')

router.get('/', controller.getAllTags)
router.get('/:id', controller.getTagById)
router.get('/:id/recipes/', controller.getTagByIdWithRecipes)

module.exports = router
