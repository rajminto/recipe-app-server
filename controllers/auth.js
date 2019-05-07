// Sequelize models
const User = require('../models').user


const registerUser = (req, res, next) => {
  const { name, email, password, password2 } = req.body
  
  // Validate user
  // TODO: improve validation
  if      (!validUser(req.body))                    res.json({ message: 'Please enter a username, email, and a password longer than 5 characters.' })
  else if (!matchingPasswords(password, password2)) res.json({ message: 'Please enter matching passwords.' })
  else {
    // Validation passed
    // Check if user already exists in db
    User.findOne({
      where: { email: email }
    })
      .then(user => {
        user
          ? res.status(409).json({ message: 'This email has already been registered. Please enter a unique email address.' })
          : res.json(req.body)
      })
  }

}


// ------------------------------ Vaidation Helpers ------------------------------

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

module.exports = {
  registerUser
}