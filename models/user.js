'use strict'
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar_url: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {})
  user.associate = function(models) {
    // associations can be defined here
    user.belongsToMany(models.recipe, {
      through: 'userRecipes',
      foreignKey: 'userId',
      otherKey: 'recipeId'
    })
  }
  return user
}