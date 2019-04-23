require('dotenv').config()
const fs = require('fs')

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    "username": "matthewwinzer",
    "password": null,
    "database": "recipe_app",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  test: {
    use_env_variable: 'DATABASE_URL'
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};