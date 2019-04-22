const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// TODO: add CORS
// TODO: add bodyParser

// Import Sequelize models
const models = require('./models')

app.get('/', (req, res, next) => {
  res.json({
    message: 'Server running!'
  })
})

app.get('/api/recipes', (req, res, next) => {
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

// TODO: add error handling

app.listen(PORT, (something) => console.log(`Server listening on port: ${PORT}`))

