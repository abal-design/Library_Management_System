const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware'); // <-- include authorize
const {
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/usercontroller');

// Example routes
router.get('/', protect, authorize('librarian'), getUsers); // Only librarian can access
router.put('/:id', protect, authorize('librarian'), updateUser);
router.delete('/:id', protect, authorize('librarian'), deleteUser);

module.exports = router;
