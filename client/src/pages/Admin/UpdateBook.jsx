import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import Logo from "../../assets/logo.png"; // Adjust path as needed

const UpdateBook = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    quantity: "",
    category: "",
    available: ""
  });
  const [dateTime, setDateTime] = useState(new Date());
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch books on page load
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      quantity: book.quantity,
      category: book.category,
      available: book.available
    });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/books/${editingBook}`,
        formData
      );

      setSuccess(res.data.message || "Book updated successfully!");
      setError("");
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("Error updating book:", err);
      setSuccess("");
      setError(
        err.response?.data?.message ||
          "Failed to update book. Please try again."
      );
    }
  };

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

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Update Book</h2>
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
            className="hover:bg-yellow-300 bg-white text-gray-800 px-3 py-1 rounded transition"
          >
            ➕ Add Book
          </button>
          <button
            onClick={() => navigate("/admin/update-book")}
            className=" bg-gray-600 text-gray-100 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            ✏️ Update
          </button>
          <button
            onClick={() => navigate("/admin/delete-book")}
            className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"
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

        {/* Main Content Area */}
        <section className="flex-1 p-8">
          {/* Error/Success messages */}
          {error && <div className="bg-red-200 text-red-800 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-200 text-green-800 p-3 rounded mb-4">{success}</div>}

          {/* Edit Form */}
          {editingBook && (
            <form
              onSubmit={handleUpdate}
              className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-lg mx-auto space-y-4"
            >
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full border p-3 rounded" />
              <input type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required className="w-full border p-3 rounded" />
              <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} required className="w-full border p-3 rounded" />
              <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required className="w-full border p-3 rounded" />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full border p-3 rounded" />
              <input type="number" name="available" placeholder="Available" value={formData.available} onChange={handleChange} required className="w-full border p-3 rounded" />

              <div className="flex justify-center">
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                  💾 Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Books Table */}
          <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Author</th>
                <th className="border border-gray-300 px-4 py-2 text-left">ISBN</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Available</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.author}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.isbn}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.category || "-"}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.available}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEditClick(book)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default UpdateBook;
