const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const borrowModel = require("../models/borrowModel");

// Borrow a book
const borrowBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    if (!bookId || !userId) {
      return res.status(400).json({ message: "Book ID and User ID required" });
    }

    // 🔎 Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // 📉 Decrease book quantity
    book.quantity = book.quantity - 1;

    // ✅ Create borrow record
    const borrow = new Borrow({
      bookId,
      userId,
      status: "Pending",
    });

    await borrow.save();
    await book.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow,
      updatedQuantity: book.quantity,
    });
  } catch (error) {
    console.error("❌ Borrow error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// Return a book
const returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    // Find borrow record
    const borrow = await Borrow.findOne({ _id: borrowId, userId: req.user.id });
    if (!borrow) return res.status(404).json({ message: "Borrow record not found" });

    if (borrow.status !== "Borrowed") {
      return res.status(400).json({ message: "This book is not marked as Borrowed" });
    }

    // Mark as returned
    borrow.status = "Returned";
    borrow.returnDate = new Date();

    // Fine calculation
    const finePerDay = 10;
    let fine = 0;

    if (borrow.returnDate > borrow.dueDate) {
      const overdueMs = borrow.returnDate - borrow.dueDate;
      const overdueDays = Math.ceil(overdueMs / (1000 * 60 * 60 * 24));
      fine = overdueDays * finePerDay;
    }

    borrow.fine = fine;

    // ✅ Increase book quantity back by 1
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }


    await borrow.save();

    res.json({
      message: "Book returned successfully",
      borrow,
      fine,
      updatedQuantity: book?.quantity || 0,
    });
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
      .populate("bookId", "title author coverImage"); // ✅ include coverImage
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
      "title author coverImage" // ✅ include coverImage
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

    // Handle stock & dates
    if (status === "Borrowed") {
      const borrowDate = borrow.borrowDate || new Date();
      borrow.borrowDate = borrowDate;
      const dueDate = new Date(borrowDate);
      dueDate.setDate(dueDate.getDate() + 15); // +15 days
      borrow.returnDate = dueDate;

      // decrease stock
      const book = await Book.findById(borrow.bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      if (book.quantity <= 0) {
        return res.status(400).json({ message: "Book is out of stock" });
      }
      book.quantity -= 1;
      await book.save();
    }

    if (status === "Returned") {
      // keep original due date for history
      const book = await Book.findById(borrow.bookId);
      if (book) {
        book.quantity += 1;
        await book.save();
      }
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







// // ✅ Check if user already has a non-returned book
    // const existingBorrow = await Borrow.findOne({
    //   userId,
    //   status: { $in: ["Pending", "Borrowed"] } // still active
    // });

    // if (existingBorrow) {
    //   return res.status(400).json({
    //     message: "You already have an active borrow request. Return it before borrowing another."
    //   });
    // }
