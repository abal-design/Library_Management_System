const Book = require('../models/bookModel');

const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity, available } = req.body;
    if (!title || !author || !isbn || !category || quantity == null || available == null) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    const book = new Book({ title, author, isbn, category, quantity, available });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
};

const deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book removed' });
};

module.exports={getBooks, createBook, updateBook, deleteBook}