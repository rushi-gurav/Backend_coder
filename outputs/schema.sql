This SQL schema defines the table structure for storing the submissions.

CREATE DATABASE sample_db;

\c sample_db

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

###