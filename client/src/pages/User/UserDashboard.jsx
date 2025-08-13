import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import PromotionCarousel from "./PromotionCarousel"; // import the carousel component

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student"); // Placeholder name, can decode from token

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const res = await axios.get("/api/books", config);
        setBooks(res.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome back, {userName}!
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
          Explore thousands of books, stay updated with library events, and enjoy
          our curated collections for college students.
        </p>
      </section>

      {/* Promotions / Announcements Carousel */}
      <PromotionCarousel />

      {/* Featured Books */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Books</h2>
          <a
            href="/user/book"
            className="text-blue-900 hover:underline font-medium"
          >
            View All →
          </a>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading books...</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {books.slice(0, 8).map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
              >
                {/* Book Cover */}
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-4xl">📚</span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-xs text-gray-500 mb-4">{book.category || "N/A"}</p>
                  <button className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition">
                    Borrow Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reading Club / Info Section */}
      <section className="bg-indigo-100 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Join Our College Reading Club
        </h2>
        <p className="max-w-2xl mx-auto text-gray-700 mb-4">
          Enhance your learning experience and explore curated reading lists,
          discussions, and workshops.
        </p>
        <p className="max-w-2xl mx-auto text-gray-600">
          ⚠️ Membership is granted by the library administrator. Please contact
          the library if you wish to join.
        </p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserDashboard;
