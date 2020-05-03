'use strict'
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define('recipe', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    img_url: DataTypes.STRING,
    prep_time: DataTypes.STRING,
    cook_time: DataTypes.STRING,
    isPrivate: DataTypes.BOOLEAN
  }, {})
  recipe.associate = function(models) {
    // associations can be defined here
    recipe.belongsToMany(models.user, {
      through: 'userRecipes',
      foreignKey: 'recipeId',
      otherKey: 'userId'
    })
    recipe.hasMany(models.ingredient, {
      foreignKey: 'recipeId'
    })
    recipe.hasMany(models.instruction, {
      foreignKey: 'recipeId'
    })
    recipe.belongsToMany(models.tag, {
      through: 'recipeTags',
      foreignKey: 'recipeId',
      otherKey: 'tagId'
    })
  }
  return recipe
}