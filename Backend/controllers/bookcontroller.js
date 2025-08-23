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







// Add book
const addBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity, available, description, coverImage } = req.body;

    // ✅ Required fields
    if (!title || !author || !category || !isbn) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // ✅ Check for existing Title OR ISBN
    const existingBook = await Book.findOne({
      $or: [{ title: title.trim() }, { isbn: isbn.trim() }]
    });

    if (existingBook) {
      if (existingBook.title === title.trim()) {
        return res.status(400).json({ message: "❌ A book with this Title already exists" });
      }
      if (existingBook.isbn === isbn.trim()) {
        return res.status(400).json({ message: "❌ A book with this ISBN already exists" });
      }
    }

    // ✅ Validate numbers
    if (quantity < 0 || available < 0) {
      return res.status(400).json({ message: "Quantity and Available must be non-negative" });
    }
    if (parseInt(available) > parseInt(quantity)) {
      return res.status(400).json({ message: "Available books cannot exceed total quantity" });
    }

    // ✅ Handle cover image
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (coverImage && /^https?:\/\/.+\..+/.test(coverImage)) {
      imagePath = coverImage;
    }

    // ✅ Create new book
    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      isbn: isbn.trim(),
      quantity,
      available,
      description: description || "",
      coverImage: imagePath,
    });

    await newBook.save();
    res.status(201).json({ message: "✅ Book added successfully", book: newBook });

  } catch (error) {
    console.error("Error adding book:", error.message);

    // ✅ Catch duplicate key errors from Mongo as backup
    if (error.code === 11000) {
      if (error.keyPattern?.title) {
        return res.status(400).json({ message: "❌ A book with this Title already exists" });
      }
      if (error.keyPattern?.isbn) {
        return res.status(400).json({ message: "❌ A book with this ISBN already exists" });
      }
      return res.status(400).json({ message: "❌ Duplicate Title or ISBN not allowed" });
    }

    res.status(500).json({ message: "⚠️ Server error" });
  }
};


// Update a book
const updateBook = async (req, res) => {
  try {
    const { title, isbn } = req.body;

    // Prevent updating to duplicate ISBN/title
    if (title || isbn) {
      const existingBook = await Book.findOne({
        $or: [{ title: title }, { isbn: isbn }],
        _id: { $ne: req.params.id } // exclude current book
      });

      if (existingBook) {
        return res.status(400).json({ message: "❌ Another book with this Title or ISBN already exists" });
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
