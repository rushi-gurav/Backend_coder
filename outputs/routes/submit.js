const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const submission = await Submission.create({ name, email, message });
    res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while submitting the form.' });
  }
});

module.exports = router;