const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'))
app.use(cors({ origin: true, credentials: true }))

// Routers
const recipesRouter = require('./routes/recipes')
const tagsRouter = require('./routes/tags')

// Routes
app.get('/', (req, res) => res.json({ message: 'Server running!' }))
app.use('/api/recipes', recipesRouter)
app.use('/api/tags', tagsRouter)

// Error handling
app.use(notFound)
app.use(errorHandler)

// eslint-disable-next-line
function notFound(req, res, next) {
  res.status(404).send({ error: 'Not found!', status: 404, url: req.originalUrl })
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line
  console.error('ERROR', err)
  const stack = process.env.NODE_ENV !== 'production' ? err.stack : undefined
  res.status(500).send({ error: err.message, stack, url: req.originalUrl })
}

// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

