import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const BorrowerBook = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch borrow records
  const fetchBorrows = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("❌ You must be logged in to view borrowed books.");
        setBorrows([]);
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/borrows/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBorrows(res.data || []);
    } catch (err) {
      console.error("Fetch borrows error:", err.response || err);
      setError("❌ Failed to fetch borrow records.");
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  // Return book
  const handleReturn = async (borrowId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ You must be logged in to return a book.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/borrows/return",
        { borrowId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("📚 Book returned successfully!");
      fetchBorrows(); // Refresh list
    } catch (err) {
      console.error("Return book error:", err.response || err);
      alert("❌ Failed to return the book.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📝 My Borrowed Books
        </h1>

        {loading && <p>Loading borrowed books...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!loading && borrows.length === 0 && !error && (
          <p className="text-gray-600">You have no borrow records.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {borrows.map((borrow) => (
            <div
              key={borrow._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {borrow.bookId?.title || "No Title"}
              </h2>
              <p className="text-gray-600 text-sm">
                By {borrow.bookId?.author || "Unknown Author"}
              </p>
              <p className="text-gray-500 text-xs">
                Borrowed on:{" "}
                {borrow.borrowDate
                  ? new Date(borrow.borrowDate).toLocaleDateString()
                  : "Unknown"}
              </p>

              <p className="mt-2">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    borrow.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : borrow.status === "Borrowed"
                      ? "bg-green-100 text-green-800"
                      : borrow.status === "Declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {borrow.status}
                </span>
              </p>

              {borrow.status === "Borrowed" && (
                <button
                  onClick={() => handleReturn(borrow._id)}
                  className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
                >
                  🔙 Return
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BorrowerBook;
