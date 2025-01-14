const express = require('express');
// const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();

// app.use(bodyParser.json());


router.delete('/api/transactions/delete/:TransactionID', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userId = req.session.user.id;
    const TransactionID = req.params.TransactionID; //imp to define cateory 
  
    try {
      const query = 'DELETE FROM Transactions WHERE UserID = ? AND TransactionID = ?';
      db.query(query, [userId, TransactionID], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json({ message: 'Budget deleted successfully.' });
        // console.log('delete successfully')
        console.log(    `delete date of this id ${TransactionID} ` );
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
});
  
// Export the router
module.exports = router;