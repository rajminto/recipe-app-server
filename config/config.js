require('dotenv').config()
// eslint-disable-next-line
const fs = require('fs')

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL'
  },
  test: {
    use_env_variable: 'DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
}