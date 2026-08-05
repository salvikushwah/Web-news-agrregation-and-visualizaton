const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

router.get('/me', protect, getMe);

// Temporary test route to prove RBAC works — we'll remove this once
// real admin routes exist in the Admin Panel module later.
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome, admin!' });
});

module.exports = router;