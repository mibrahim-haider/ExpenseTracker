const express = require('express');
const db = require('../database/db');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const router = express.Router();
const app = express();


// Middleware to parse JSON data
app.use(bodyParser.json());

// API Endpoint: Register User
router.post('/api/register', async (req, res) => {
  const { username, password, email, fullName } = req.body;

  // Check if all required fields are present
  if (!username || !password || !email || !fullName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const query = 'INSERT INTO Users (Username, PasswordHash, Email, FullName) VALUES (?, ?, ?, ?)';
    db.query(query, [username, hashedPassword, email, fullName], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Username or Email already exists.' });
        }
        throw err;
      }
      // Store user session after successful login
      req.session.user = {
        id: result.insertId, // Get the newly inserted user's ID /// very imp for secure route
        username,
      };
      res.status(201).json({ message: 'User registered successfully.' });
      // req.session.user = { id: user.UserID, username };   not use this because there use inserted id 

    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
});

// Export the router
module.exports = router;
