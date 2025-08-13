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

// Create a new book
const createBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity, available } = req.body;
    const coverImage = req.file ? req.file.filename : null; // store filename

    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      quantity,
      available,
      coverImage
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};





// const createBook = async (req, res) => {
//   try {
//     const { title, author, isbn, category, quantity, available, coverImage } = req.body;

//     if (!title || !author || !isbn || !category || quantity == null || available == null) {
//       return res.status(400).json({ message: "Please provide all required fields" });
//     }

//     const book = new Book({ title, author, isbn, category, quantity, available, coverImage });
//     await book.save();
//     res.status(201).json(book);
//   } catch (error) {
//     console.error("Error creating book:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

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

module.exports = { getBooks, createBook, updateBook, deleteBook };
