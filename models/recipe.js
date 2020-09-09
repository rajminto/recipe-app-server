'use strict'
module.exports = (sequelize, DataTypes) => {
  const recipe = sequelize.define(
    'recipe',
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      img_url: DataTypes.STRING,
      prep_time: DataTypes.STRING,
      cook_time: DataTypes.STRING,
      isPrivate: DataTypes.BOOLEAN,
      saveCount: DataTypes.INTEGER,
    },
    {}
  )
  recipe.associate = function (models) {
    // associations can be defined here
    recipe.belongsToMany(models.user, {
      through: 'userRecipes',
      foreignKey: 'recipeId',
      otherKey: 'userId',
    })
    recipe.hasMany(models.ingredient, {
      foreignKey: 'recipeId',
    })
    recipe.hasMany(models.instruction, {
      foreignKey: 'recipeId',
    })
    recipe.belongsToMany(models.tag, {
      through: 'recipeTags',
      foreignKey: 'recipeId',
      otherKey: 'tagId',
    })
  }

  // class method assignment
  recipe.findAllRecipesPaginated = findAllRecipesPaginated

  return recipe
}

// recipe model class methods
function findAllRecipesPaginated(offset = 0, limit = 20) {
  return this.findAll({
    include: [
      {
        model: this.sequelize.models.user,
        attributes: ['id', 'name'],
        through: { where: { createdBy: true }, attributes: [] },
      },
      { model: this.sequelize.models.ingredient, attributes: ['id', 'name'] },
      {
        model: this.sequelize.models.instruction,
        attributes: ['id', 'description', 'order'],
      },
      {
        model: this.sequelize.models.tag,
        attributes: ['id', 'name'],
        through: { attributes: [] },
      },
    ],
    order: [
      ['id', 'ASC'],
      [this.sequelize.models.instruction, 'order', 'ASC'],
      [this.sequelize.models.ingredient, 'id', 'ASC'],
    ],
    offset: offset,
    limit: limit,
  })
}
