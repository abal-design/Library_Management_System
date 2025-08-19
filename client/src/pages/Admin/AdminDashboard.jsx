import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/DefaultAvatar.png";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Adjust if needed

const Dashboard = () => {
  const navigate = useNavigate();
  

  const [stats, setStats] = useState({
    totalBooks: 0,
    registeredUsers: 0,
    booksBorrowed: 0,
    overdueReturns: 0,
  });
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
    
      const token = localStorage.getItem("token");
      const name = localStorage.getItem('name');
      const profilePicture = localStorage.getItem('profilePicture');
      setAdmin({...admin,name: name, profilePicture:profilePicture})
      if (!token) {
        navigate("/login");
        return;
      }
    
      const config = { headers: { Authorization: `Bearer ${token}` } };
    
      try {
        // Fetch both at the same time
        const [statsRes, userRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/reports/stats`, config),
          axios.get(`${API_BASE_URL}/api/auth/me`, config),
        ]);
      
        // Handle stats
        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data);
        } else {
          console.error("Stats API error:", statsRes.reason?.response?.data || statsRes.reason?.message);
        }
      
        // Handle admin info
        if (userRes.status === "fulfilled") {
          setAdmin(userRes.value.data);
        } else {
          console.error("User API error:", userRes.reason?.response?.data || userRes.reason?.message);
        }
      
        // If both failed
        if (statsRes.status === "rejected" && userRes.status === "rejected") {
          setError("Failed to load data.");
        }
      } catch (err) {
        console.error("Unexpected dashboard error:", err);
        setError("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600 font-semibold">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
          <h1 className="text-2xl font-bold text-center mt-2">LMS Admin</h1>
        </div>
        <nav className="flex flex-col gap-4 p-6 flex-1">
          <Link to="/admin/dashboard" className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded"> Dashboard</Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">Add User</Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 px-3 py-2 rounded"> Manage Books</Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded"> Manage Users </Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">Reports</Link>
          <Link to="/admin/reset-password" className="hover:bg-blue-800 px-3 py-2 rounded">Reset User Password</Link>
        </nav>
        
        <button
          onClick={handleLogout}
          className="bg-yellow-400 m-6 text-black px-4 py-2 rounded hover:bg-yellow-300 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <div>
              <h2 className="text-xl font-semibold text-blue-900">Dashboard</h2>
              <p className="text-sm text-gray-600">
                Welcome back, <strong>{admin.name || "Admin"}</strong> 👋
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 hidden md:block">
            {currentTime.toLocaleString()}
          </div>
        </header>

        {/* Admin Info */}
        <div className="p-6 border-b border-blue-700 text-center bg-white rounded-md shadow-md mx-4 md:mx-8 mt-4">
          <img
            src={admin.profilePicture || defaultAvatar}
            alt={admin.name || "Admin"}
            className="h-20 w-20 rounded-full mx-auto mb-3 object-cover border border-white"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h2 className="text-xl font-bold">{admin.name || "Admin"}</h2>
          <p className="text-sm">{admin.email}</p>
        </div>

        {/* Stats */}
        <section className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded shadow p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Total Books</h3>
            <p className="text-3xl font-extrabold text-blue-900">
              {stats.totalBooks}
            </p>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Registered Users</h3>
            <p className="text-3xl font-extrabold text-blue-900">
              {stats.registeredUsers}
            </p>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Books Borrowed</h3>
            <p className="text-3xl font-extrabold text-blue-900">
              {stats.booksBorrowed}
            </p>
          </div>
          <div className="bg-white rounded shadow p-6 text-center">
            <h3 className="text-lg font-bold mb-2">Overdue Returns</h3>
            <p className="text-3xl font-extrabold text-blue-900">
              {stats.overdueReturns}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;