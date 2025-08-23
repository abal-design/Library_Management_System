const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");

// Borrow a book
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) return res.status(400).json({ message: "Book ID is required" });

    // Calculate fine if overdue (Rs.10/day after due date)
    if (borrow.returnDate > borrow.dueDate) {
      const diffDays = Math.ceil((borrow.returnDate - borrow.dueDate) / (1000 * 60 * 60 * 24));
      borrow.fine = diffDays * 10;
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.quantity <= 0)
      return res.status(400).json({ message: "Book out of stock" });

    // Reduce available quantity immediately
    book.quantity -= 1;
    await book.save();


    

    const borrow = await Borrow.create({
      userId: req.user.id,
      bookId,
      status: "Pending", // librarian will later update to "Borrowed"
    });

    res.status(201).json({
      message: "Borrow request sent",
      borrow,
      remainingQuantity: book.quantity, // return updated quantity
    });
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

    // Set return date
    borrow.status = "Returned";
    borrow.returnDate = new Date();

    // 📌 Fine calculation
    const finePerDay = 10; // change as needed
    const dueDate = new Date(borrow.dueDate);
    const returnedDate = new Date(borrow.returnDate);

    let fine = 0;
    if (returnedDate > dueDate) {
      const overdueMs = returnedDate - dueDate;
      const overdueDays = Math.ceil(overdueMs / (1000 * 60 * 60 * 24));
      fine = overdueDays * finePerDay;
    }

    borrow.fine = fine; // store fine in DB
    await borrow.save();

    // Increase available quantity again
    const book = await Book.findById(borrow.bookId);
    if (book) {
      book.quantity += 1;
      await book.save();
    }

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
