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
app.get('/', (req, res, next) => res.json({ message: 'Server running!' }))
app.use('/api/recipes', recipesRouter)

// Error handling
app.use(notFound)
app.use(errorHandler)

function notFound(req, res, next) {
  res.status(404).send({ error: 'Not found!', status: 404, url: req.originalUrl })
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  console.error('ERROR', err)
  const stack = process.env.NODE_ENV !== 'production' ? err.stack : undefined
  res.status(500).send({ error: err.message, stack, url: req.originalUrl })
}

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))

