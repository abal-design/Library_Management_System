const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const Borrow = require("../models/borrowModel"); // your borrow schema


router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();  // <-- here
    const borrowedBooks = await Borrow.countDocuments({ status: "Borrowed" });

    res.json({ totalUsers, totalBooks, borrowedBooks });
  } catch (error) {
    console.error("Error fetching report stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const User = require("../models/userModel");
// const Book = require("../models/bookModel");
// const Borrow = require("../models/borrowModel"); // your borrow schema

// router.get("/stats", async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalBooks = await Book.countDocuments();

//     // Count borrowed books by checking borrow docs with status "Borrowed"
//     const borrowedBooks = await Borrow.countDocuments({ status: "Borrowed" });

//     res.json({ totalUsers, totalBooks, borrowedBooks });
//   } catch (error) {
//     console.error("Error fetching report stats:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
