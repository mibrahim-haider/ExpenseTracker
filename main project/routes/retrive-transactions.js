const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();

app.use(bodyParser.json());

router.get('/api/345refS3Ddd/transactions', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userId = req.session.user.id;
  
    try {
      const query = 'SELECT * FROM Transactions WHERE UserID = ? ORDER BY Date DESC';
      db.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
});

// Export the router
module.exports = router;