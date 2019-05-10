const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// Sequelize models
const User = require('../models').user

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({ 
        where: { email: email }
      })
        .then(async user => {
          // No user found: return with error message
          if (!user) return done(null, false, { message: 'That email is not registered. Please try again.'})
          // User found: check for matching password
          const match = await bcrypt.compare(password, user.password)
          return match
            ? done(null, user)
            : done(null, false, { message: 'Incorrect password. Please try again.' })
        })
        // eslint-disable-next-line
        .catch(console.log)
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        if (user) done(null, user)
        else throw new Error('user not found')
      })
      .catch(err => {
        done(err, false)
      })
  })
}