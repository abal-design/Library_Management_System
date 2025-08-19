const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // shared upload
const { register, login, verifyOtp, resetUserPassword } = require('../controllers/authcontroller');

// Routes
router.post('/register', upload.single('profileImage'), register); // Multer added here
router.post('/login', login);
router.post('/verifyOtp', verifyOtp);
router.put('/reset-password', protect, authorize('librarian'), resetUserPassword);

module.exports = router;
