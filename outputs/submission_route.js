const express = require('express');
const router = express.Router();
const Submission = require('./Submission');

// POST /submit
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Create new submission
    const newSubmission = new Submission({
      name,
      email,
      message,
    });

    // Save to database
    await newSubmission.save();

    res.status(201).json({ msg: 'Submission successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

Ensure to install the necessary packages with npm:
npm install express mongoose dotenv body-parser

And also make sure you have a `.env` file at the root of your project that contains your MongoDB URI:
MONGO_URI=your_mongodb_connection_string

This will set up a basic server that can handle POST requests to `/submit` and save the form data to MongoDB.