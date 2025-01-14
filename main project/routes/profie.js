const express = require('express');
const db = require('../database/db');
const bodyParser = require('body-parser');

const router = express.Router();
const app = express();


// Middleware to parse JSON data
app.use(bodyParser.json());

router.get('/api/user-profile', (req, res) => {
    const userId = req.session.user.id; // Retrieve the user ID from session

    // Query the database to get user data
    const query = 'SELECT FullName, Email FROM Users WHERE UserID = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch user data' });
        }

        if (result.length > 0) {
            res.json(result[0]); // Send back the user data
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Export the router
module.exports = router;
