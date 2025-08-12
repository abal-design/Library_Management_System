const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookcontroller');

router.get('/', protect, getBooks); // Get all books (any logged in user)
router.post('/', protect, authorize('librarian'), createBook); // Create new book (only librarian)
router.put('/:id', protect, authorize('librarian'), updateBook); // Update book by id (only librarian)
router.delete('/:id', protect, authorize('librarian'), deleteBook); // Delete book by id (only librarian)

module.exports = router;
