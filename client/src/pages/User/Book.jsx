import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Book = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view books.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ You must be logged in to borrow a book");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/borrows",
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Borrow request sent successfully!");
      console.log(res.data); // Optional: log response
    } catch (err) {
      console.error(err.response?.data || err);
      alert(`❌ Failed to send borrow request: ${err.response?.data?.message || err.message}`);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-amber-50 min-h-screen">
      <Navbar />

      <motion.main
        className="flex-grow max-w-7xl mx-auto bg-amber-50 px-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      ></motion.main>

      <main className="flex-grow max-w-7xl mx-auto bg-amber-50 px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📚 Available Books
        </h1>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="bg-gray-300 h-48 w-full rounded-md mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && books.length === 0 && (
          <p className="text-gray-600">No books found.</p>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col group"
              >
                {/* Book Image */}
                <div className="overflow-hidden rounded-md">
                  <img
                    src={book.coverImage || "https://via.placeholder.com/150"}
                    alt={book.title}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />v
                </div>

                {/* Book Info */}
                <div className="mt-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {book.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-1">
                    By {book.author}
                  </p>
                  <p className="text-gray-500 text-xs">ISBN: {book.isbn}</p>
                  <p className="text-gray-500 text-xs">
                    Quantity: {book.quantity}
                  </p>

                  {/* Borrow Button */}
                  <div className="flex flex-row-auto mt-2">
                  <button
                    onClick={() => handleBorrow(book._id)}
                    className="mt-auto px-4 py-2 bg-blue-600 w-[60%] text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md"
                  >
                    Borrow
                  </button>
                  {/* Open the modal using document.getElementById('ID').showModal() method */}
                  <button className="btn mt-auto ml-2 px-4 py-2 bg-blue-600 w-[40%] text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md" 
                  onClick={() => { setSelectedBook(book); document.getElementById('my_modal_1').showModal(); }} 
                  > 
                  Details... 
                  </button>
                  
                  <dialog id="my_modal_1" className="modal">
                    {selectedBook && (
                      <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg">{selectedBook.title}</h3>
                        <img
                          src={selectedBook.coverImage || "https://via.placeholder.com/150"}
                          alt={selectedBook.title}
                          className="w-full h-48 object-cover rounded-md my-2"
                        />
                        <p className="py-1"><strong>Author:</strong> {selectedBook.author}</p>
                        <p className="py-1"><strong>ISBN:</strong> {selectedBook.isbn}</p>
                        <p className="py-1"><strong>Quantity:</strong> {selectedBook.quantity}</p>
                        <p className="py-2"><strong>Description:</strong> {selectedBook.description || "No description available."}</p>
                        <div className="modal-action">
                          <form method="dialog">
                            <button className="btn">Close</button>
                          </form>
                        </div>
                      </div>
                    )}
                  </dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Book;
