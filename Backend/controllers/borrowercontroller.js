const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");

// Borrow a book
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) return res.status(400).json({ message: "Book ID is required" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.quantity <= 0)
      return res.status(400).json({ message: "Book out of stock" });

    const borrow = await Borrow.create({
      userId: req.user.id,
      bookId,
      status: "Pending",
    });

    res.status(201).json({ message: "Borrow request sent", borrow });
  } catch (err) {
    console.error("❌ borrowBook error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;
    const borrow = await Borrow.findOne({ _id: borrowId, userId: req.user.id });

    if (!borrow) return res.status(404).json({ message: "Borrow record not found" });
    if (borrow.status !== "Borrowed")
      return res.status(400).json({ message: "Book is not borrowed" });

    borrow.status = "Returned";
    borrow.returnDate = new Date();
    await borrow.save();

    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

    res.json({ message: "Book returned successfully", borrow });
  } catch (err) {
    console.error("❌ returnBook error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all borrow records (librarian)
const getBorrowRecords = async (req, res) => {
  try {
    const records = await Borrow.find()
      .populate("userId", "name email")
      .populate("bookId", "title author");
    res.json(records);
  } catch (err) {
    console.error("❌ getBorrowRecords error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get borrow records for current borrower
const getUserBorrows = async (req, res) => {
  try {
    const records = await Borrow.find({ userId: req.user.id }).populate(
      "bookId",
      "title author"
    );
    res.json(records);
  } catch (err) {
    console.error("❌ getUserBorrows error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ FIXED Update borrow status (for librarian)
const updateBorrowStatus = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    const { status } = req.body;
    borrow.status = status;

    if (status === "Borrowed") {
      const borrowDate = borrow.borrowDate || new Date();
      borrow.borrowDate = borrowDate;
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 15); // +15 days
      borrow.returnDate = dueDate;
    }

    if (status === "Returned") {
      // keep the original due date (submit date)
      // OR you could clear it:
      // borrow.returnDate = null;
    }

    if (status === "Declined") {
      borrow.returnDate = null; // no due date
    }

    await borrow.save();
    res.json(borrow);
  } catch (err) {
    res.status(500).json({ message: "Error updating borrow request", error: err.message });
  }
};

module.exports = {
  borrowBook,
  getBorrowRecords,
  getUserBorrows,
  returnBook,
  updateBorrowStatus,
};
