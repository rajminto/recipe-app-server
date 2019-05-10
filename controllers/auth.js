const bcrypt = require('bcrypt')
const passport = require('passport')

// Sequelize models
const User = require('../models').user


const registerUser = (req, res, next) => {
  const { name, email, password, password2 } = req.body
  
  // Validate user
  // TODO: improve validation
  if      (!validUser(req.body))                    res.status(400).json({ message: 'Please enter a username, email, and a password longer than 5 characters.' })
  else if (!matchingPasswords(password, password2)) res.status(400).json({ message: 'Please enter matching passwords.' })
  else {
    // Validation passed: check if user already exists in db
    User.findOne({
      where: { email: email }
    })
      .then(user => {
        // User already exists: throw error and respond in .catch
        if (user) throw new Error('existing user')
        else {
          // User doesn't exist: hash password
          const saltRounds = 10
          return bcrypt.hash(password, saltRounds)
        }
      })
      .then(hash => {
        // Create new user with hashed password
        return User.create(createUserObject(name, email, hash))
      })
      .then(newUser => {
        res.status(201).json({ user: cleanUser(newUser) })
      })
      .catch(err => {
        if (err.message === 'existing user') res.status(409).json({ message: 'This email has already been registered. Please try again with a different email.' })
        else next(err)
      })
  }
}

const loginUser = (req, res, next) => {
  passport.authenticate(
    'local', 
    (err, user, info) => {
      if (err) return next(err)
      // User not found: respond with custom error message from local strategy config (info object)
      if (!user) return res.status(400).json(info)
      // User found: login and respond
      req.logIn(user, (err) => {
        if (err) return next(err)
        return res.json({
          message: 'You are now logged in!',
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        })
      })
    })(req, res, next)
}

const testAuthentication = (req, res) => {
  req.isAuthenticated()
    ? res.json({
      message: 'You are currently logged in!',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    })
    : res.status(401).json({ message: 'You are not logged in.' })
}


// ------------------------------ Validation Helpers ------------------------------
function validUser({ name, email, password, password2 }) {
  const fieldsPresent = name && email && password && password2
  const validName = typeof name === 'string'
  const validEmail = typeof email === 'string'
  const validPassword = typeof password === 'string' && password.length > 5
  const validPassword2 = typeof password2 === 'string' && password2.length > 5

  return fieldsPresent && validName && validEmail && validPassword && validPassword2
}

function matchingPasswords(password1, password2) {
  return password1 === password2
}

// ------------------------------ Create User Helpers ------------------------------

function createUserObject(name, email, hash) {
  return {
    name: name,
    email: email,
    password: hash
  }
}

function cleanUser({ id, name, email }) {
  return { id, name, email }
}

module.exports = {
  registerUser,
  loginUser,
  testAuthentication
}