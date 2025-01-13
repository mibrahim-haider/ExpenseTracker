const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection

const router = express.Router();

// Middleware to parse JSON data
router.use(bodyParser.json());

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session?.user) {
        return next(); // Proceed if the user is authenticated
    }
    res.redirect('/'); // Redirect to the login page or homepage
}

// API Endpoint: Reset Password
router.post('/api/change/password', isAuthenticated, async (req, res) => {
    const { password, newPassword } = req.body;

    // Validate input
    if (!password || !newPassword) {
        return res.status(400).json({ message: 'Both fields are required.' });
    }

    try {
        const userId = req.session.user.id;

        // Fetch user data from the database by user ID
        const query = 'SELECT PasswordHash FROM Users WHERE UserID = ?';

        db.query(query, [userId], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User does not exist. Please register first.' });
            }

            const user = results[0];

            // Compare provided password with stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid current password. Please try again.' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password in the database
            const updatePasswordQuery = 'UPDATE Users SET PasswordHash = ? WHERE UserID = ?';

            db.query(updatePasswordQuery, [hashedPassword, userId], (err) => {
                if (err) {
                    console.error('Error updating password:', err);
                    return res.status(500).json({ message: 'Error updating password.' });
                }

                res.status(200).json({ message: 'Password changed successfully.' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
});

module.exports = router;