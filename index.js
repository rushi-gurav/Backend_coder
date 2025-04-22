const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Load Telegram bot
require('./bot');

app.get('/', (req, res) => {
  res.send('✅ Your Telegram Bot is alive on Render!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
