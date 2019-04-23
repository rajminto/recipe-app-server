'use strict'
module.exports = (sequelize, DataTypes) => {
  const instruction = sequelize.define('instruction', {
    description: DataTypes.TEXT,
    order: DataTypes.INTEGER,
    recipeId: DataTypes.INTEGER
  }, {})
  instruction.associate = function(models) {
    // associations can be defined here
    instruction.belongsTo(models.recipe, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    })
  }
  return instruction
}