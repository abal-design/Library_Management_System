const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { borrowBook, returnBook, getBorrowRecords } = require('../controllers/borrowercontroller');

router.post('/', protect, authorize('borrower'), borrowBook);
router.post('/return', protect, authorize('borrower'), returnBook);
router.get('/records', protect, authorize('librarian'), getBorrowRecords);

module.exports = router;
