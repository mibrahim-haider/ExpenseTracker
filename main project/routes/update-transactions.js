const express = require('express');
// const bodyParser = require('body-parser');
const db = require('../database/db'); // Import the database connection from a separate file

const router = express.Router();
const app = express();

// app.use(bodyParser.json());

router.post('/api/transactions', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.session.user.id;
  const { type, amount, category, description, date } = req.body;



  if (!type || !amount || !category) {
    return res.status(400).json({ message: 'Type, amount, and category are required.' });
  }

  // Validate and parse the date
  const dateParts = date.split('/'); // Assuming date format is DD/MM/YYYY
  if (dateParts.length !== 3) {
    return res.status(400).json({ message: 'Invalid date format. Use DD/MM/YYYY.' });
  }

  const [day, month, year] = dateParts;
  const formattedDate = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD

  // Validate the reformatted date
  if (isNaN(new Date(formattedDate).getTime())) {
    return res.status(400).json({ message: 'Invalid date value.' });
  }

  // use all there in query small letter
  try {
    const query = 'INSERT INTO Transactions (UserID, type, amount, category, description, date) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, type, amount, category, description, formattedDate], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error.' });
      }
      res.status(201).json({ message: 'Transaction added successfully.' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });

  }
});

// Export the router
module.exports = router;