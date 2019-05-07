const express = require('express')
const router = express.Router()


router.get('/login', (req, res, next) => {
  res.send('hello')
})

router.get('/register', (req, res, next) => {
  res.send('hello')
})

module.exports = router