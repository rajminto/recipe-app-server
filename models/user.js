'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    console.log(models)
    User.hasMany(models.Recipe, {
      foreignKey: 'userId'
    })
  };
  return User;
};