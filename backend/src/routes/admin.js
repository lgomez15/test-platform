const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Subject, Test, Result, sequelize } = require('../models');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.use(verifyToken);
router.use(verifyAdmin);

// Create User (Student)
router.post('/users', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword, role: role || 'student' });
        res.json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Subject
router.post('/subjects', async (req, res) => {
    try {
        const { name } = req.body;
        const subject = await Subject.create({ name });
        res.json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List Subjects
router.get('/subjects', async (req, res) => {
    try {
        const subjects = await Subject.findAll();
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assign Subject to User
router.post('/assign-subject', async (req, res) => {
    try {
        const { userId, subjectId } = req.body;
        const user = await User.findByPk(userId);
        const subject = await Subject.findByPk(subjectId);

        if (!user || !subject) return res.status(404).json({ error: 'User or Subject not found' });

        await user.addSubject(subject);
        res.json({ message: 'Subject assigned' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload Test
router.post('/tests', async (req, res) => {
    try {
        const { title, subjectId, questions } = req.body; // questions is JSON array
        const test = await Test.create({ title, SubjectId: subjectId, questions });
        res.json(test);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Tests
router.get('/tests', async (req, res) => {
    try {
        const tests = await Test.findAll({ include: Subject });
        res.json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// View Results
router.get('/results', async (req, res) => {
    try {
        const results = await Result.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: Test, attributes: ['title'] }
            ]
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
