// Sequelize models
const db = require('../models')
const Tag = db.tag

const getAllTags = (req, res, next) => {
  Tag.findAll({
    attributes: ['id', 'name', 'img_url'],
  })
    .then((tags) => res.json({ tags }))
    .catch(next)
}

const getTagById = (req, res, next) => {
  Tag.findByPk(req.params.id, {
    attributes: ['id', 'name', 'img_url'],
  })
    .then((tag) => {
      tag
        ? res.json(tag)
        : res
            .status(404)
            .json({ message: 'Tag not found. Please enter a valid ID.' })
    })
    .catch(next)
}

const getTagByIdWithRecipes = (req, res, next) => {
  Tag.findByPk(req.params.id)
    .then((tag) => {
      return tag
        ? // TODO?: return recipes with their accompanying ingredients, instructions, tags
          tag.getRecipes()
        : res
            .status(404)
            .json({ message: 'Tag not found. Please enter a valid ID.' })
    })
    .then((recipes) => {
      recipes
        ? res.json({ recipes })
        : res.status(404).json({
            message:
              'No recipes found with that tag. Please select another tag.',
          })
    })
    .catch(next)
}

module.exports = {
  getAllTags,
  getTagById,
  getTagByIdWithRecipes,
}
