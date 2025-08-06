const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookcontroller');

router.get('/', protect, getBooks);
router.post('/', protect, authorize('librarian'), createBook);
router.put('/:id', protect, authorize('librarian'), updateBook);
router.delete('/:id', protect, authorize('librarian'), deleteBook);

module.exports = router;
