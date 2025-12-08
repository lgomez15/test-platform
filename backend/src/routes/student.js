const express = require('express');
const router = express.Router();
const { User, Subject, Test, Result } = require('../models');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

// Get Assigned Tests
router.get('/tests', async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            include: {
                model: Subject,
                include: Test
            }
        });

        // Flatten structure: User -> Subjects -> Tests
        let tests = [];
        if (user && user.Subjects) {
            user.Subjects.forEach(subject => {
                if (subject.Tests) {
                    subject.Tests.forEach(test => {
                        tests.push({
                            id: test.id,
                            title: test.title,
                            subjectName: subject.name,
                            questions: test.questions // Send questions to client so they can take it
                        });
                    });
                }
            });
        }
        res.json(tests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit Test Result
router.post('/submit', async (req, res) => {
    try {
        const { testId, score, answers } = req.body;
        const result = await Result.create({
            UserId: req.userId,
            TestId: testId,
            score,
            answers
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get My Results
router.get('/results', async (req, res) => {
    try {
        const results = await Result.findAll({
            where: { UserId: req.userId },
            include: { model: Test, attributes: ['title'] }
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
