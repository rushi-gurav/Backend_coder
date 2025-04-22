This file defines the POST `/submit` route.

const express = require('express');
const router = express.Router();
const Entry = require('../../models/Entry');

// @route   POST api/entries
// @desc    Create a new entry
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newEntry = new Entry({
      name,
      email,
      message
    });

    const entry = await newEntry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

###