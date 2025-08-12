import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu as MenuIcon } from "lucide-react";
import Logo from "../../assets/logo.png"; // adjust path as needed

const AddBook = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
    available: ""
  });

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
        const config = {
           headers: {
            Authorization: `Bearer ${token}`
          }
        };

      // Ensure quantity and available are numbers
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        available: Number(formData.available)
      };

      // await axios.post("/api/books/admin/add-book", formData);
      const res = await axios.post("/api/books", bookData, config);
      alert("Book added successfully!");
      navigate("/admin/manage-book"); // redirect to manage books page after adding
    } catch (error) {
      console.error("Error adding book:", error.response?.data || error.message);
      alert("Failed to add book");
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
          <Link to="/admin/dashboard" className="hover:bg-blue-800 px-3 py-2 rounded">
            Dashboard
          </Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">
            Add User
          </Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded">
            Manage Books
          </Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded">
            Manage Users
          </Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">
            Reports
          </Link>
          <button
            onClick={handleLogout}
            className="bg-yellow-400 text-black mb-3 fixed bottom-0 px-4 py-2 rounded hover:bg-yellow-300 transition mt-auto"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Add Books</h2>
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
            className="hover:bg-yellow-300 bg-gray-600 text-gray-100 px-3 py-1 rounded transition"
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
            className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            🗑️ Delete
          </button>
        </div>

        {/* Add Book Form */}
        <div className="bg-white mt-6 p-6 rounded  shadow-md w-120 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-medium">ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                className="border p-2 w-full rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Available</label>
              <input
                type="number"
                name="available"
                value={formData.available}
                onChange={handleChange}
                required
                min="0"
                className="border p-2 w-full rounded"
              />
            </div>


            <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Book
            </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddBook;
