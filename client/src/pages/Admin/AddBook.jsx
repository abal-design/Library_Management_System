import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu as MenuIcon } from "lucide-react";
import Logo from "../../assets/logo.png";

const AddBook = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    quantity: "",
    available: "",
    description: "",
    coverImage: "", // store image link directly
  });

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Logout function
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

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validation rules
    if (!formData.title.trim() || !formData.author.trim()) {
      alert("Title and Author are required.");
      return;
    }

    if (!/^\d{10}(\d{3})?$/.test(formData.isbn)) {
      alert("ISBN must be 10 or 13 digits.");
      return;
    }

    if (formData.quantity < 0 || formData.available < 0) {
      alert("Quantity and Available must be non-negative.");
      return;
    }

    if (parseInt(formData.available) > parseInt(formData.quantity)) {
      alert("Available books cannot exceed total quantity.");
      return;
    }

    if (formData.coverImage && !/^https?:\/\/.+\..+/.test(formData.coverImage)) {
      alert("Cover image must be a valid URL (starting with http/https).");
      return;
    }

    if (formData.description && formData.description.length > 500) {
      alert("Description cannot exceed 500 characters.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.post("/api/books", formData, config);
      alert("Book added successfully!");
      navigate("/admin/manage-book");
    } catch (error) {
      console.error("Error adding book:", error.response?.data || error.message);
        
      if (error.response?.data?.message) {
        alert(error.response.data.message); // show backend error message
      } else {
        alert("❌ Failed to add book");
      }
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
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Add Book</h2>
          </div>
          <div className="text-sm text-gray-600">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>
        </header>

        {/* CRUD Buttons */}
        <div className="flex gap-2 mt-2 p-4">
          <button onClick={() => navigate("/admin/manage-book")} className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition">📖 View All</button>
          <button onClick={() => navigate("/admin/add-book")} className="hover:bg-yellow-300 bg-gray-600 text-gray-100 px-3 py-1 rounded transition">➕ Add Book</button>
          <button onClick={() => navigate("/admin/update-book")} className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition">✏️ Update</button>
          <button onClick={() => navigate("/admin/delete-book")} className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition">🗑️ Delete</button>
          <button onClick={() => navigate("/admin/borrow-page")} className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"> 📥 Borrow Request </button>
        </div>

        {/* Add Book Form */}
        <div className="bg-white mt-6 p-6 rounded shadow-md w-120 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {["title", "author", "category", "isbn", "quantity", "available", "description", "coverImage"].map((field) => (
              <div key={field}>
                <label className="block font-medium capitalize">{field}</label>
                <input
                  type={field === "quantity" || field === "available" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== "description" && field !== "coverImage"} // optional for description & image
                  min={field === "quantity" || field === "available" ? 0 : undefined}
                  maxLength={field === "description" ? 500 : undefined}
                  className="border p-2 w-full rounded"
                />
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded"
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
