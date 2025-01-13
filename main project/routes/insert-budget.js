const express = require('express');
// const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();

// app.use(bodyParser.json());




router.post('/api/budgets', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const userId = req.session.user.id;
    const { category, amount, period } = req.body;
  
    if (!category || !amount) {
      return res.status(400).json({ message: 'Category and amount are required.' });
    }
  
    try {
      const query = `
        INSERT INTO Budgets (UserID, category, amount, period)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        amount = VALUES(amount) 
        `
       ;
      db.query(query, [userId, category, amount, period], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error.' });
        }
        res.status(201).json({ message: 'Budget added or updated successfully.' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error.', error });
    }
});
  
// Export the router
module.exports = router;