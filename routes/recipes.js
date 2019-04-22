const express = require('express')
const router = express.Router()

const models = require('../models')

router.get('/', (req, res, next) => {
  models.recipe.findAll({
    include: [
      { model: models.user },
      'ingredients',
      'instructions',
      'tags'
    ]
  })
    .then(recipes => {
      res.json({ recipes })
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ message: 'Something went wrong...' })
    })
})

router.get('/:id', (req, res, next) => {
  // TODO: handle requests for id's not present

  models.recipe.findByPk(req.params.id, {
    include: [
      { model: models.user },
      'ingredients',
      'instructions',
      'tags'
    ]
  })
    .then(recipe => {
      res.json({ recipe })
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ message: 'Something went wrong...' })
    })
})

module.exports = router