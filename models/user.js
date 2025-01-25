'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // associations can be defined here
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastLogin: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('active', 'blocked'),
      defaultValue: 'active',
      allowNull: false
    },
    registrationTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};