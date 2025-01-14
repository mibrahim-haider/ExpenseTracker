const express = require('express');
// const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();

// app.use(bodyParser.json());


router.delete('/api/budgets/:category/:period', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userId = req.session.user.id;
    const category = req.params.category; //imp to define cateory 
    const period = req.params.period;
  
    try {
      const query = 'DELETE FROM Budgets WHERE UserID = ? AND category = ? AND period = ?';
      db.query(query, [userId, category, period], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error.' });
        }
        res.status(200).json({ message: 'Budget deleted successfully.' });
        // console.log('delete successfully')
        console.log(    `the budget progress of ${category} of ${period}  del ` );
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
});
  
// Export the router
module.exports = router;
