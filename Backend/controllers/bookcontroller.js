const Book = require('../models/bookModel');

getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

createBook = async (req, res) => {
  const { title, author, isbn, quantity } = req.body;
  const bookExists = await Book.findOne({ isbn });
  if (bookExists) return res.status(400).json({ message: 'Book already exists' });

  const book = await Book.create({ title, author, isbn, quantity, available: quantity });
  res.status(201).json(book);
};

updateBook = async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(book);
};

deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book removed' });
};

module.exports={getBooks, createBook, updateBook, deleteBook}