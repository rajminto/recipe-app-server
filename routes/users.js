const express = require('express')
const router = express.Router()


router.get('/login', (req, res, next) => {
  res.send('hello from login')
})

router.get('/register', (req, res, next) => {
  res.send('hello from register')
})

module.exports = router