const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware'); // <-- include authorize
const { logoutUser }= require('../controllers/authcontroller')
const {
  getUsers,
  updateUser,
  deleteUser,
  getMe,
} = require('../controllers/usercontroller');

// Example routes
router.get('/me', protect, getMe);
router.get('/', protect, authorize('librarian'), getUsers); // Only librarian can access
router.put("/:id", protect, authorize("librarian"), updateUser);
router.post("/logout", protect, logoutUser);
router.delete('/:id', protect, authorize('librarian'), deleteUser);

module.exports = router;
