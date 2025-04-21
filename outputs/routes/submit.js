This route handler for `/submit` handles POST requests and saves data to the database.

const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

router.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const submission = await Submission.create({ name, email, message });
        res.status(201).json({ message: "Submission successful", data: submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;

###