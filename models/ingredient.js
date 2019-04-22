'use strict';
module.exports = (sequelize, DataTypes) => {
  const ingredient = sequelize.define('ingredient', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER
  }, {});
  ingredient.associate = function(models) {
    // associations can be defined here
    ingredient.belongsTo(models.recipe, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    })
  };
  return ingredient;
};