const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// TODO: add CORS
// TODO: add bodyParser

const morgan = require('morgan')

// Middleware
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'))

// Routers
const recipesRouter = require('./routes/recipes')

// Routes
app.get('/', (req, res, next) => {
  res.json({
    message: 'Server running!'
  })
})

app.use('/api/recipes', recipesRouter)

// TODO: add error handling

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

