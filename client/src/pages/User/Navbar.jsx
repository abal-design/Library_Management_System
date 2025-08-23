// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import defaultAvatar from "../../assets/DefaultAvatar.png";
import Logo from "../../assets/logo.png";
import axios from "axios";

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUsers] = useState({ profilePicture: "" });

  useEffect(() => {
    const profilePicture = localStorage.getItem("profilePicture");
    if (profilePicture) {
      setUsers((prev) => ({ ...prev, profilePicture }));
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.post(
          "/api/users/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Logout error:", err.response?.data || err.message);
      }
    }
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar bg-blue-900 shadow-md px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10" />
        <h1 className="text-xl font-bold text-white ml-3">User Dashboard</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 px-6">
        <input
          type="text"
          placeholder="Search Books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link to="/user/dashboard" className={`text-white ${isActive("/user/dashboard") ? "font-bold" : ""}`}>Home</Link>
        <Link to="/user/book" className={`text-white ${isActive("/user/book") ? "font-bold" : ""}`}>Books</Link>
        <Link to="/user/aboutus" className={`text-white ${isActive("/user/aboutus") ? "font-bold" : ""}`}>About Us</Link>
        <Link to="/user/contact" className={`text-white ${isActive("/user/contact") ? "font-bold" : ""}`}>Contact Us</Link>
        <Link to="/user/borrower" className={`text-white ${isActive("/user/borrower") ? "font-bold" : ""}`}>Borrow Details</Link>
      </div>

      {/* Avatar */}
      <div className="dropdown dropdown-end ml-6">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              src={user.profilePicture || defaultAvatar}
              alt="user"
              className="h-20 w-20 rounded-full mx-auto mb-3 object-cover border border-white"
              onError={(e) => (e.currentTarget.src = defaultAvatar)}
            />
          </div>
        </div>
        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white text-gray-800 rounded-box z-10 mt-3 w-52 p-2 shadow">
          <li><button onClick={handleLogout}>Logout</button></li>
          <li><Link to="/user/profile">Profile</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
