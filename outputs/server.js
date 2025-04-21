const express = require('express');
const connectDB = require('./db');
const bodyParser = require('body-parser');
const submissionRoute = require('./submission_route');

require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/submit', submissionRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));