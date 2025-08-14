const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // shared upload
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookcontroller');

// Routes
router.post('/', protect, authorize('librarian'), upload.single('coverImage'), createBook);
router.get('/', protect, getBooks);
router.put('/:id', protect, authorize('librarian'), updateBook);
router.delete('/:id', protect, authorize('librarian'), deleteBook);

module.exports = router;
