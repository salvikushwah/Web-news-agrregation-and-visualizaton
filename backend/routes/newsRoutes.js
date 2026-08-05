const express = require('express');
const router = express.Router();
const { triggerIngestion } = require('../controllers/newsIngestionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/fetch', protect, authorize('admin'), triggerIngestion);

module.exports = router;