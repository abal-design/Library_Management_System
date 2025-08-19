const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  borrowBook,
  returnBook,
  getBorrowRecords,
  getUserBorrows,
  updateBorrowStatus,
} = require("../controllers/borrowercontroller");

// Borrow a book (borrower)
router.post("/", protect, authorize("borrower"), borrowBook);

// Return a book (borrower)
router.post("/return", protect, authorize("borrower"), returnBook);

// Cancel pending request (borrower)
// router.delete("/:id", protect, authorize("borrower"), cancelBorrowRequest);

// Get all borrow records (librarian)
router.get("/records", protect, authorize("librarian"), getBorrowRecords);

// Get borrow records for current borrower
router.get("/user", protect, authorize("borrower"), getUserBorrows);
router.put("/:id", protect, authorize("librarian"), updateBorrowStatus);



module.exports = router;
