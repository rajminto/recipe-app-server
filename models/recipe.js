'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('recipe', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    img_url: DataTypes.STRING,
    prep_time: DataTypes.STRING,
    cook_time: DataTypes.STRING
  }, {});
  Recipe.associate = function(models) {
    // associations can be defined here
    Recipe.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
  };
  return Recipe;
};