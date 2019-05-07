const express = require('express')
const router = express.Router()

router.post('/register', (req, res, next) => {
  const { name, email, password, password2 } = req.body
  res.json(req.body)
})

module.exports = router