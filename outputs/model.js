const mongoose = require('mongoose');
const Contact = require('./schema');

const createContact = async (data) => {
  try {
    const newContact = new Contact(data);
    await newContact.save();
    console.log('Contact created:', newContact);
    return newContact;
  } catch (err) {
    console.error('Error creating contact:', err);
    throw err;
  }
};

module.exports = createContact;