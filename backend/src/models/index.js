const sequelize = require('../config/database');
const User = require('./User');
const Subject = require('./Subject');
const Test = require('./Test');
const Result = require('./Result');

// Relationships

// User (Student) <-> Subject (Many-to-Many)
User.belongsToMany(Subject, { through: 'UserSubjects' });
Subject.belongsToMany(User, { through: 'UserSubjects' });

// Subject <-> Test (One-to-Many)
Subject.hasMany(Test);
Test.belongsTo(Subject);

// User <-> Result (One-to-Many)
User.hasMany(Result);
Result.belongsTo(User);

// Test <-> Result (One-to-Many)
Test.hasMany(Result);
Result.belongsTo(Test);

module.exports = {
    sequelize,
    User,
    Subject,
    Test,
    Result
};
