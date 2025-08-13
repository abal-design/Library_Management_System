import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/books?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="navbar bg-blue-900 shadow-md px-6">
      {/* Logo & Title */}
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10" />
        <h1 className="text-xl font-bold text-white ml-3">User Dashboard</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 px-6">
        <input
          type="text"
          placeholder="Search Books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link
          to="/user/dashboard"
          className="text-white font-medium hover:text-yellow-300 transition"
        >
          Home
        </Link>
        <Link
          to="/user/book"
          className="text-white font-medium hover:text-yellow-300 transition"
        >
          Books
        </Link>
        
        <Link
          to="/user/aboutus" className="text-white font-medium hover:text-yellow-300 transition">
          About Us
        </Link>
      </div>

      {/* User Avatar Dropdown */}
      <div className="dropdown dropdown-end ml-6">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full border-2 border-yellow-400">
            <img
              alt="User Avatar"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-white text-gray-800 rounded-box z-10 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a href="/" className="hover:bg-gray-100 rounded-md">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
