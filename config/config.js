require('dotenv').config()
const fs = require('fs')

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
  },
  test: {
    use_env_variable: 'DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};