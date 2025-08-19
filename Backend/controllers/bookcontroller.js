const Book = require('../models/bookModel');

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Create a new book
// const createBook = async (req, res) => {
//   try {
//     const { title, author, category, isbn, quantity, available } = req.body;
//     const coverImage = req.file ? req.file.filename : null; // store filename

//     const book = await Book.create({
//       title,
//       author,
//       category,
//       isbn,
//       quantity,
//       available,
//       coverImage
//     });

//     res.status(201).json(book);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };







//Add book
const addBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity, available } = req.body;

    if (!title || !author || !category || !isbn) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const newBook = new Book({
      title,
      author,
      category,
      isbn,
      quantity,
      available,
      coverImage: req.file ? `/uploads/${req.file.filename}` : "", // ✅ save relative path
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a book
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body, // include coverImage if sent
      { new: true }
    );
    res.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book removed" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getBooks, updateBook, addBook,  deleteBook };
