import React, { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    // Typically you'd send this to a backend via fetch or axios
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Contact Us</h2>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Message:</label>
        <textarea name="message" value={form.message} onChange={handleChange} required />
      </div>
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm;
