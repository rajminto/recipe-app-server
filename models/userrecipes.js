'use strict'
module.exports = (sequelize, DataTypes) => {
  const userRecipe = sequelize.define(
    'userRecipes',
    {
      userId: DataTypes.INTEGER,
      recipeId: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
    },
    {}
  )
  userRecipe.associate = function (models) {
    // associations can be defined here
    userRecipe.belongsTo(models.recipe, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE',
    })
    userRecipe.belongsTo(models.user, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE',
    })
  }
  return userRecipe
}
