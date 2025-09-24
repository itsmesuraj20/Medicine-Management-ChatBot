const express = require('express');
const router = express.Router();

// Placeholder for customer routes
router.get('/', (req, res) => {
  res.json({ message: 'Customer routes' });
});

module.exports = router;