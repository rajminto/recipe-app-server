require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000

const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

// Passport config
require('./config/passport')(passport)

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'))
app.use(cors({ origin: true, credentials: true }))

// Express session middleware
// TODO: Re-enable secure cookies in production
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routers
const recipesRouter = require('./routes/recipes')
const tagsRouter = require('./routes/tags')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

// Routes
app.get('/', (req, res) => res.json({ message: 'Server running!' }))
app.use('/api/recipes', recipesRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)

// Error handling
app.use(notFound)
app.use(errorHandler)

// eslint-disable-next-line
function notFound(req, res, next) {
  res
    .status(404)
    .send({ error: 'Not found!', status: 404, url: req.originalUrl })
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
