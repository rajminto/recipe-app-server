const express = require('express')
const router = express.Router()

const controller = require('../controllers/tag')

router.get('/', controller.getAllTags)
router.get('/:id', controller.getTagById)

module.exports = router