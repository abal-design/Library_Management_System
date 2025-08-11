import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import { Search } from "lucide-react";
import { FaRegTrashAlt } from "react-icons/fa";

const ManageBook = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("AllBook"); // default tab
  const [search, setSearch] = useState(""); //  added search state

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", stock: "10", isbn: "9780743273565" },
    { id: 2, title: "Sapiens", author: "Yuval Noah Harari", category: "History", stock: "10", isbn: "9780062316097" },
    { id: 3, title: "Clean Code", author: "Robert C. Martin", category: "Programming", stock: "10", isbn: "9780132350884" },
    { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", stock: "10", isbn: "9780547928227" },
  ];

  // Optional: filter by ID search
  const filteredBooks = books.filter((book) =>
    search.trim() === "" ? true : String(book.title).includes(search.trim())
  );

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
          <h1 className="text-2xl font-bold text-center">LMS Admin</h1>
        </div>
        <nav className="flex flex-col gap-4 p-6 flex-1">
          <Link to="/admin/dashboard" className="hover:bg-blue-800 px-3 py-2 rounded">Dashboard</Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">Add User</Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded">Manage Books</Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Users</Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">Reports</Link>
          <button
            onClick={handleLogout}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition mt-auto"
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
            <h2 className="text-xl font-semibold text-blue-900">Manage Books</h2>
          </div>
          
        </header>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-4 p-4">
          <div className="flex space-x-2 bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("AllBook")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "AllBook"
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-700"
              }`}
            >
              All Books
            </button>


            <button
              onClick={() => setActiveTab("AddBook")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "AddBook"
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-700"
              }`}
            >
              Add Books
            </button>
            
            <button
              onClick={() => setActiveTab("UpdateBook")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "UpdateBook"
                  ? "bg-black text-white"
                  : "bg-transparent text-gray-700"
              }`}
            >
              Update Books
            </button>
          </div>

          {/* Search by ID */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Books"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Book Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Title</th>
                <th className="border p-2">Author</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">ISBN</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50">
                  <td className="border p-2">{book.id}</td>
                  <td className="border p-2">{book.title}</td>
                  <td className="border p-2">{book.author}</td>
                  <td className="border p-2">{book.category}</td>
                  <td className="border p-2">{book.stock}</td>
                  <td className="border p-2">{book.isbn}</td>
                  <td className="border p-2 text-center">
                    <button className="text-red-500 hover:text-red-700">
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageBook;
