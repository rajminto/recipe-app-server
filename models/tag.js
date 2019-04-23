'use strict'
module.exports = (sequelize, DataTypes) => {
  const tag = sequelize.define('tag', {
    name: DataTypes.STRING,
    img_url: DataTypes.STRING
  }, {})
  tag.associate = function(models) {
    // associations can be defined here
    tag.belongsToMany(models.recipe, {
      through: 'recipeTags',
      foreignKey: 'tagId',
      otherKey: 'recipeId'
    })
  }
  return tag
}