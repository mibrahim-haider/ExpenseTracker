const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();

// Middleware to parse JSON data; necessary for parsing JSON requests
app.use(bodyParser.json());

// Redirect if the user is authenticated
function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect('/home');
  }
  next(); // Proceed to the requested route if user is not authenticated
}

// API Endpoint: Reset Password
router.post('/api/of/of/reset', redirectIfAuthenticated, async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Check if all required fields are present
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    console.log('The new password and confirm password do not match.');
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Fetch user data from the database by email
    const query = 'SELECT Email FROM Users WHERE Email = ?';
    
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Email address does not exist. Register first.' });
      }

      // If user exists, update the password
      const updatePasswordQuery = 'UPDATE Users SET PasswordHash = ? WHERE Email = ?';

      db.execute(updatePasswordQuery, [hashedPassword, email], (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ message: 'Error updating password.' });
        }

        // Respond with a success message if password is updated
        res.status(200).json({ message: 'Password reset successfully.' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error.', error });
  }
});

// Export the router
module.exports = router;