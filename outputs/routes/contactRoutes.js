const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  const newContact = new Contact({
    name,
    email,
    message
  });

  try {
    await newContact.save();
    res.status(201).json({ message: 'Contact submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error submitting contact form', error: err.message });
  }
});

module.exports = router;