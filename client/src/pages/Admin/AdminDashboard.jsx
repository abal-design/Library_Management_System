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
  });
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      const profilePicture = localStorage.getItem("profilePicture");
      setAdmin({ ...admin, name: name, profilePicture: profilePicture });

      if (!token) {
        navigate("/");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [statsRes, userRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/reports/stats`, config),
          axios.get(`${API_BASE_URL}/api/auth/me`, config),
        ]);

        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data);
        } else {
          console.error(
            "Stats API error:",
            statsRes.reason?.response?.data || statsRes.reason?.message
          );
        }

        if (userRes.status === "fulfilled") {
          setAdmin(userRes.value.data);
        } else {
          console.error(
            "User API error:",
            userRes.reason?.response?.data || userRes.reason?.message
          );
        }

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
          <h1 className="text-2xl font-bold text-center">LMS Admin</h1>
        </div>
        <nav className="flex flex-col gap-4 p-6 flex-1">
          <Link to="/admin/dashboard" className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded"> Dashboard</Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">Add User</Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 px-3 py-2 rounded"> Manage Books</Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded"> Manage Users </Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">Reports</Link>
          <Link to="/admin/reset-password" className="hover:bg-blue-800 px-3 py-2 rounded">Reset User Password</Link>
          <button onClick={handleLogout} className="bg-yellow-400 cursor-pointer text-black mb-3 fixed bottom-0 px-4 py-2 rounded hover:bg-yellow-300 transition mt-auto">Logout</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex pb-8 flex-col">
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

        {/* 📢 Announcement Section */}
        <div className="mx-4 md:mx-8 mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-md shadow">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
            📢 Announcement
          </h3>
          <p className="text-gray-800 mb-2 font-medium">
            Library System Upgrade Completed 🎉
          </p>
          <ul className="list-disc list-inside text-gray-700 text-sm mb-2">
            <li>📚 Faster book search with improved filters</li>
            <li>📊 Advanced reporting for borrowing & returns</li>
            <li>🔔 Smart reminders for overdue books</li>
            <li>👥 Better user management controls</li>
          </ul>
          <p className="text-sm text-gray-700">
            <strong>Action Required:</strong> Please review pending borrow
            requests and ensure your profile information is up to date.
          </p>
        </div>
  
        {/* 📝 Notices Section */}
        <div className="mx-4 md:mx-8 mt-6 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-md shadow">
          <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
            📝 Notices
          </h3>
          <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
            <li>📅 <strong>Library Holiday:</strong> Closed on <em>September 10</em> for maintenance.</li>
            <li>👥 <strong>Staff Meeting:</strong> Librarians’ monthly meeting on <em>September 10, 3 PM</em> in the Main Hall.</li>
            <li>⚠️ <strong>Overdue Reminder:</strong> Overdue fines apply after <em>3 days of late return</em>.</li>
          </ul>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
