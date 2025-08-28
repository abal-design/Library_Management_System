import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // make sure you import it


  // console.log(decoded); // See all fields

// Now you can send userId to the backend in your request body or params

const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/books", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBooks(res.data);
      } catch (err) {
        setError("⚠️ Failed to load books. Please try again later.");
        console.error(err);
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


    const decoded = jwtDecode(token);
    const userId = decoded.id; // 👈 extract userId from token

    const res = await axios.post(
      "http://localhost:5000/api/borrows",
      { bookId, userId }, // 👈 send both
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("✅ Borrow request sent successfully!");
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err);
    alert(
      `❌ Failed to send borrow request: ${
        err.response?.data?.message || err.message
      }`
    );
  }
};


  // Helper function to check availability
  const isAvailable = (quantity) => quantity > 0;

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book._id.includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            📚 Explore Our Books
          </h1>
          <p className="text-lg md:text-xl">
            Find your next read and manage your library easily.
          </p>
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-6 px-4 py-2 rounded-md border border-white text-black w-full max-w-md"
          />
        </div>
      </section>

      {/* Book Listings */}
      <main className="flex-grow bg-gray-50 px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800">All Books</h2>

        {/* Error */}
        {error && <p className="text-center text-red-600 mt-4">{error}</p>}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <p className="text-center text-gray-600 mt-6">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col"
              >
                <img
                  src={book.coverImage || "https://via.placeholder.com/150"}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-900">
                  {book.title}
                </h2>
                <p className="text-gray-600 text-sm">By {book.author}</p>
                <p className="text-gray-500 text-xs">ISBN: {book.isbn}</p>
                <p className="text-gray-700 font-medium">
                  Available:{" "}
                  <span
                    className={`${
                      isAvailable(book.available)
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {book.available}
                  </span>
                </p>

                <div className="flex flex-row mt-2 gap-2">
                  {/* Borrow Button */}
                  <button
                    onClick={() => handleBorrow(book._id)}
                    disabled={!isAvailable(book.available)}
                    className={`px-4 py-2 w-[60%] text-white rounded-lg transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md ${
                      isAvailable(book.available)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Borrow
                  </button>

                  {/* Details Button */}
                  <button
                    className="px-4 py-2 w-[40%] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out shadow-sm hover:shadow-md"
                    onClick={() => {
                      setSelectedBook(book);
                      setIsModalOpen(true);
                    }}
                  >
                    Details...
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && selectedBook && (
        <div className="fixed inset-0 bg-transparent flex justify-center items-center z-50">
          <div className="bg-black text-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="font-bold text-lg">{selectedBook.title}</h3>
            <img
              src={selectedBook.coverImage || "https://via.placeholder.com/150"}
              alt={selectedBook.title}
              className="w-full h-48 object-cover rounded-md my-2"
            />
            <p className="py-1">
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p className="py-1">
              <strong>ISBN:</strong> {selectedBook.isbn}
            </p>
            <p className="py-1">
              <strong>Available:</strong> {selectedBook.available}
            </p>
            <p className="py-2">
              <strong>Description:</strong>{" "}
              {selectedBook.description || "No description available."}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookPage;
