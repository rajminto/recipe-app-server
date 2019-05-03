// Sequelize models
const db = require('../models')
const Tag = db.tag

const getAllTags =  (req, res, next) => {
  Tag.findAll()
    .then(tags => res.json({ tags }))
    .catch(next)
}

module.exports = {
  getAllTags
}