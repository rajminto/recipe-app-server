'use strict';
module.exports = (sequelize, DataTypes) => {
  const recipeTag = sequelize.define('recipeTag', {
    recipeId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {});
  recipeTag.associate = function(models) {
    // associations can be defined here
    recipeTag.belongsToMany(models.recipe, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    })
    recipeTag.belongsToMany(models.tag, {
      foreignKey: 'tagId',
      onDelete: 'CASCADE'
    })
  };
  return recipeTag;
};