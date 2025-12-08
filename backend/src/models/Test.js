const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    questions: {
        type: DataTypes.TEXT, // Storing JSON string
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('questions');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('questions', JSON.stringify(value));
        }
    }
});

module.exports = Test;
