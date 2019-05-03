const express = require('express')
const router = express.Router()

const controller = require('../controllers/tag')

router.get('/', controller.getAllTags)


module.exports = router