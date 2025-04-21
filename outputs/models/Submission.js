This Sequelize model corresponds to the `submissions` table.

const { DataTypes } = require('sequelize');
const db = require('../db');

const Submission = db.define('Submission', {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'submissions',
    timestamps: true,
    createdAt: 'created_at',
});

module.exports = Submission;

###