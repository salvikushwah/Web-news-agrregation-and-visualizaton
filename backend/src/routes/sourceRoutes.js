const express = require('express');
const router = express.Router();
const {
  getSources, getSource, createSource, updateSource, deleteSource,
} = require('../controllers/sourceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getSources);
router.get('/:id', getSource);
router.post('/', protect, authorize('admin'), createSource);
router.put('/:id', protect, authorize('admin'), updateSource);
router.delete('/:id', protect, authorize('admin'), deleteSource);

module.exports = router;