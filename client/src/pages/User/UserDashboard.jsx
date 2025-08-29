import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import PromotionCarousel from "./PromotionCarousel"; // import the carousel component
import Logo from "../../assets/Logo.png"

const promotions = [
  {
    image: "https://iic.edu.np/image/new-homebanner.png",
    text: "Discover the IIC Lifestyle",
    url: "https://iic.edu.np/" // Adidas official site
  },
  {
    image: "https://islington.edu.np/images/islington-white-logo.svg",
    text: "DEVELOPING INDUSTRY READY GRADUATES - SINCE 1996",
    url: "https://islington.edu.np/" // Apple iPhone page
  },
  {
    image: "https://icp.edu.np/images/logo.svg",
    text: "Ensuring an Enjoyable Lifestyle alongside a Path to Professional Fulfilment.",
    url: "https://icp.edu.np/" // Daraz Nepal
  },
  {
    image: "https://www.londonmet.ac.uk/media/london-met-redesign/site-assets/images/london-metropolitan-university-logo.svg",
    text: [
      "Based in one of the world's most exciting capital cities,",
      "London Met is home to a welcoming community of inspiring and determined learners,",
      "teachers and innovative thinkers."
    ],
    url: "https://www.londonmet.ac.uk/" // Daraz Nepal
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
              <a
                key={index}
                href={promo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center mx-4 gap-3 bg-white/10 px-4 py-2 rounded-md flex-shrink-0 hover:bg-white/20 transition cursor-pointer"
                style={{ minWidth: "fit-content" }}
              >
                <img
                  src={promo.image}
                  alt="promotion"
                  className="h-12 w-12 bg-amber-50 object-cover rounded-full flex-shrink-0"
                />
                <span className="text-white font-semibold">
                  {Array.isArray(promo.text)
                    ? promo.text.map((line, idx) => (
                        <p key={idx} className="leading-snug">
                          {line}
                        </p>
                      ))
                    : promo.text}
                </span>
              </a>
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
              animation: scroll 30s linear infinite;
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
