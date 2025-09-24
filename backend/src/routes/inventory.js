const express = require('express');
const router = express.Router();

// Placeholder for inventory routes
router.get('/', (req, res) => {
  res.json({ message: 'Inventory routes' });
});

module.exports = router;