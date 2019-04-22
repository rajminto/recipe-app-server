const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

// TODO: add CORS
// TODO: add bodyParser

app.get('/', (req, res, next) => {
  res.json({
    message: 'Server running!'
  })
})

// TODO: add error handling

app.listen(PORT, (something) => console.log(`Server listening on port: ${PORT}`))

