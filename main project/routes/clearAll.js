const express = require('express');
// const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();

// app.use(bodyParser.json());


router.delete('/api/clearAll/Transactions/data/All', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userId = req.session.user.id;
  
    try {
      const query = 'DELETE FROM Transactions WHERE UserID = ?';
      db.query(query, [userId ], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json({ message: 'Clear Data successfully.' });
        console.log(' all clear ')
      });
      
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
});
  
// Export the router
module.exports = router;