const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // shared upload
const { getBooks, addBook, updateBook, deleteBook } = require('../controllers/bookcontroller');


// Routes
// router.post('/', protect, authorize('librarian'), upload.single('coverImage'), createBook);
router.post("/", protect, authorize("Librarian"), upload.single("coverImage"), addBook);
router.get('/', protect, getBooks);
router.put('/:id', protect, authorize('librarian'), updateBook);
router.delete('/:id', protect, authorize('librarian'), deleteBook);

module.exports = router;
