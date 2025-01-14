const express = require('express');
const router = express.Router();

// Logout route
router.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.status(200).json({ message: 'Logout successful.' });
  });
});

module.exports = router;
