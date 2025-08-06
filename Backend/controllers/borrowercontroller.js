const Book = require('../models/bookModel');
const Borrow = require('../models/borrowModel');

borrowBook = async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book || book.available < 1) return res.status(400).json({ message: 'No copies available' });

  book.available -= 1;
  await book.save();

  const borrow = await Borrow.create({ userId: req.user._id, bookId });
  res.status(201).json(borrow);
};

returnBook = async (req, res) => {
  const { borrowId } = req.body;
  const borrow = await Borrow.findById(borrowId).populate('bookId');

  if (!borrow || borrow.returnDate) return res.status(400).json({ message: 'Invalid borrow record' });

  borrow.returnDate = new Date();
  await borrow.save();

  const book = await Book.findById(borrow.bookId._id);
  book.available += 1;
  await book.save();

  res.json({ message: 'Book returned successfully' });
};

getBorrowRecords = async (req, res) => {
  const records = await Borrow.find().populate('userId bookId');
  res.json(records);
};

module.exports={borrowBook, returnBook, getBorrowRecords}
