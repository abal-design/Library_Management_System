import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png"; // adjust path to your logo
import { MenuIcon } from "@heroicons/react/outline"; // example icon

const DeleteBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get("/api/books", config);
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "/api/users/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
  
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`/api/books/${id}`, config);
    
      setBooks((prev) => prev.filter((book) => book._id !== id));
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error.response?.data || error.message);
      alert(error.response?.data?.message || error.message || "Failed to delete book.");
    }
  };
  if (loading) {
    return <p className="text-center text-gray-600">Loading books...</p>;
  }


  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
          <h1 className="text-2xl font-bold text-center">LMS Admin</h1>
        </div>
        <nav className="flex flex-col gap-4 p-6 flex-1">
          <Link to="/admin/dashboard" className="hover:bg-blue-800 px-3 py-2 rounded"> Dashboard</Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">Add User</Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded"> Manage Books</Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded"> Manage Users </Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">Reports</Link>
          <Link to="/admin/reset-password" className="hover:bg-blue-800 px-3 py-2 rounded">Reset User Password</Link>
          <button onClick={handleLogout} className="bg-yellow-400 cursor-pointer text-black mb-3 fixed bottom-0 px-4 py-2 rounded hover:bg-yellow-300 transition mt-auto">Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Delete Books</h2>
          </div>
          <div className="text-sm text-gray-600">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>
        </header>

        {/* CRUD Buttons */}
        <div className="flex gap-2 mt-2 p-4">
          <button
            onClick={() => navigate("/admin/manage-book")}
            className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            📖 View All
          </button>
          <button
            onClick={() => navigate("/admin/add-book")}
            className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            ➕ Add Book
          </button>
          <button
            onClick={() => navigate("/admin/update-book")}
            className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            ✏️ Update
          </button>
          <button
            onClick={() => navigate("/admin/delete-book")}
            className="bg-gray-600 text-gray-100 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            🗑️ Delete
          </button>
          <button
              onClick={() => navigate("/admin/borrow-page")}
              className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"
            >
            📥 Borrow Request
          </button>
        </div>

        {/* Books Table */}
        <div className="p-4">
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border p-2">#</th>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Author</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">ISBN</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Available</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {books.length > 0 ? (
                  books.map((book, index) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{book.title}</td>
                      <td className="border p-2">{book.author}</td>
                      <td className="border p-2">{book.category || "N/A"}</td>
                      <td className="border p-2">{book.isbn}</td>
                      <td className="border p-2 text-center">{book.quantity}</td>
                      <td className="border p-2 text-center">{book.available}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4 text-gray-500">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteBook;
