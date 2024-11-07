'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations
    }
  }
  
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    weight: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    country: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
