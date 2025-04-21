const express = require('express');
const router = express.Router();
const createContact = require('../model');

router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const contact = await createContact({ name, email, message });
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;