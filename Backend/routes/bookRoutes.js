const express = require('express');
const router = express.Router();
const { protect, authorize, resetUserPassword } = require('../middleware/authMiddleware');
const { getBooks, createBook, updateBook, deleteBook } = require('../controllers/bookcontroller');


const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // create this folder in your backend root
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', protect, authorize('librarian'), upload.single('coverImage'), createBook);

router.get('/', protect, getBooks); // Get all books (any logged in user)
router.put('/reset-password', protect, authorize('librarian'), resetUserPassword);
router.put('/:id', protect, authorize('librarian'), updateBook); // Update book by id (only librarian)
router.delete('/:id', protect, authorize('librarian'), deleteBook); // Delete book by id (only librarian)

module.exports = router;
