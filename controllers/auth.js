

const registerUser = (req, res, next) => {
  const { name, email, password, password2 } = req.body
  
  // TODO: improve validation
  if (!validUser(req.body)) res.json({ message: 'Please enter a username, email, and a password longer than 5 characters.' })
  else if (!validPasswords(password, password2)) res.json({ message: 'Please enter matching passwords.' })
  else {
    res.json(req.body)
  }

}


function validUser({ name, email, password, password2 }) {
  const fieldsPresent = name && email && password && password2
  const validName = typeof name === 'string'
  const validEmail = typeof email === 'string'
  const validPassword = typeof password === 'string' && password.length > 5
  const validPassword2 = typeof password2 === 'string' && password2.length > 5

  return fieldsPresent && validName && validEmail && validPassword && validPassword2
}

function validPasswords(password1, password2) {
  return password1 === password2
}

module.exports = {
  registerUser
}