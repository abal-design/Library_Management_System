import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import PromotionCarousel from "./PromotionCarousel"; // import the carousel component

const promotions = [
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/800px-Adidas_Logo.svg.png",
    text: "🔥 Adidas Sale: Up to 30% off!",
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    text: "📱 iPhone 15 Pro Available Now!",
  },
  {
    image: "https://imgs.search.brave.com/DxmeW5qgtcberATgMhnUpbkIgW_7jWfDTUeO8wqtO9g/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvNTBiNzZlOTkz/MmQ3OGQzYTkxNDYz/ZjUzN2QyMjQ3ZWVh/NjA2ZTVmODJkNDE3/YmQ2MWNkOGE1OTcw/YTNjNWFmMS93d3cu/ZGFyYXoucGsv",
    text: "🛒 Daraz Mega Deals This Week!",
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    text: "⚡ Tesla Model Y Pre-Order Open!",
  },
  {
    image: "https://imgs.search.brave.com/Zy_79_MoC-LakZROAxmriA7Pr1U5e0wcqq8DLsCppig/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvODc5YTNjMjQ0/NDJmOGIwMmQwYjNk/N2IzZjU4ZTU2MzVm/YjAxZDljODM3ZTk5/NjE0MTgzOTYxY2U0/ZGY3YWUwMS9hYm91/dC5uaWtlLmNvbS8",
    text: "👟 Nike Sneakers – Buy 1 Get 1!",
  },
];


const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student"); // Placeholder name, can decode from token

  const navigate = useNavigate();

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
                  <button
                  onClick={() => navigate("/user/book")} 
                  className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition">
                    Get now...
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


        <section className="relative bg-blue-800 py-10">
        {/* Section title */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            🔥 Latest Promotions
          </h2>
          <p className="text-white/80 mt-2">
            Grab the latest deals from top brands like Adidas, iPhone, Daraz, Tesla, and more! Don’t miss out!
          </p>
        </div>

        {/* Scrolling promotions */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll whitespace-nowrap items-center">
            {promotions.concat(promotions).map((promo, index) => (
              <div
                key={index}
                className="flex items-center mx-4 gap-3 bg-white/10 px-4 py-2 rounded-md flex-shrink-0"
                style={{ minWidth: "fit-content" }} // ensures box width adapts to content
              >
                <img
                  src={promo.image}
                  alt={promo.text}
                  className="h-12 w-12 object-cover rounded-full flex-shrink-0"
                />
                <span className="text-white font-semibold">{promo.text}</span>
              </div>
            ))}
          </div>
        </div>
          
        {/* Animation styles */}
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              display: inline-flex;
              animation: scroll 12s linear infinite;
            }
          `}
        </style>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserDashboard;
