const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Submission extends Model {}

Submission.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Submission'
});

module.exports = Submission;