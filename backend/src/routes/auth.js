const express = require('express');
const router = express.Router();

// Placeholder for other routes
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes' });
});

module.exports = router;