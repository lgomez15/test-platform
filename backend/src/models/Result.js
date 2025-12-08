const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    answers: {
        type: DataTypes.TEXT, // Storing JSON string of user answers if needed
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('answers');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('answers', JSON.stringify(value));
        }
    }
});

module.exports = Result;
