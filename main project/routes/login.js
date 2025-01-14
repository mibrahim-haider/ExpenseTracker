const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();


// Middleware to parse JSON data imp to use for data in json otherwise err
app.use(bodyParser.json());

function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    //  authenticated user is , redirect to the dashboard
    return res.redirect('/home');
  }
  next(); // Proceed to the requested route if user not authenticated
}

// API Endpoint: Login User
router.post('/api/of/login', redirectIfAuthenticated ,async (req, res) => {
    const { username, password } = req.body;
  
    // Check if all required fields are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      // Fetch user data from the database
      const query = 'SELECT UserID, PasswordHash FROM Users WHERE Username = ?';
      db.query(query, [username], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error.' });
        }
  
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid username or password.' });
        }
  
        const user = results[0];  // give the hashedpassward
  
        // Compare provided password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid username or password.' });
        }
        
        // Store user session after successful login
        req.session.user = { id: user.UserID, username };  /// very imp for secure route
        // Successful login
        res.status(200).json({ message: 'Login successful.', userId: user.UserID });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
});
  
// Export the router
module.exports = router;