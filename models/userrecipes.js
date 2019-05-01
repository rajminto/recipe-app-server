'use strict';
module.exports = (sequelize, DataTypes) => {
  const userRecipes = sequelize.define('userRecipes', {
    userId: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER
  }, {});
  userRecipes.associate = function(models) {
    // associations can be defined here
  };
  return userRecipes;
};