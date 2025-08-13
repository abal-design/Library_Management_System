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
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
    
      const token = localStorage.getItem("token");
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















// import React from 'react'
// import { useNavigate } from 'react-router-dom';
// import Logo from '../../assets/logo.png';
// import {
//   BookOpenIcon,
//   UsersIcon,
//   ClipboardCheckIcon,
//   ExclamationIcon,
//   MenuIcon,
// } from '@heroicons/react/outline';
// import { Link } from 'react-router-dom';

// const stats = [
//   {
//     title: 'Total Books',
//     value: 1204,
//     icon: BookOpenIcon,
//   },
//   {
//     title: 'Registered Users',
//     value: 245,
//     icon: UsersIcon,
//   },
//   {
//     title: 'Books Borrowed',
//     value: 134,
//     icon: ClipboardCheckIcon,
//   },
//   {
//     title: 'Overdue Returns',
//     value: 7,
//     icon: ExclamationIcon,
//   },
// ];

// const AdminDashboard= () => {

//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/');
//   };
//   return (
//     <div className="min-h-screen flex bg-gray-100 text-gray-800">
//       {/* Header */}
//       <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
//         <div className="p-6 border-b border-blue-700">
//           <img src={Logo} alt="Logo" className="h-16 ml-16 items-center" />
//           <h1 className="text-2xl font-bold ml-9">LMS Admin</h1>
          
//         </div>
//         <nav className="flex flex-col gap-4 p-6">
//           <Link to="/admin/dashboard" className="hover:bg-blue-800 bg-blue-800 active:bg-blue-800 px-3 py-2 rounded">Dashboard</Link>
//           <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">Add User</Link>
//           <Link to="/admin/manage-book" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Books</Link>
//           <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Users</Link>
//           <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">Reports</Link>
//           <button
//           onClick={handleLogout}
//           className="bg-yellow-400 mb-3 fixed bottom-0 text-black px-4 py-2 rounded hover:bg-yellow-300 transition">
//           Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white shadow-md p-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
//             <h2 className="text-xl font-semibold text-blue-900">Admin Dashboard</h2>
//           </div>
//           <div className="text-sm text-gray-600 hidden md:block">Welcome back, Admin 👋</div>
//         </header>

//         {/* Dashboard */}
//         <section className="p-6">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Library Overview</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {stats.map((stat, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition p-5 flex items-center gap-4"
//               >
//                 <stat.icon className="h-10 w-10 text-blue-900" />
//                 <div>
//                   <p className="text-sm text-gray-500">{stat.title}</p>
//                   <p className="text-xl font-bold text-blue-900">{stat.value}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Call to Action */}
//           <div className="mt-8 bg-white border border-gray-200 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between">
//             <div>
//               <h4 className="text-lg font-semibold text-gray-800">Manage Your Library Efficiently</h4>
//               <p className="text-sm text-gray-600">Click below to access the management control panel.</p>
//             </div>
//             <button className="mt-4 md:mt-0 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-2 rounded-lg shadow transition">
//               Go to Management Panel
//             </button>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="mt-auto text-center py-4 text-sm bg-gray-900 text-white">
//           &copy; 2025 Library Management System | Admin Panel
//         </footer>
//       </main>
//     </div>
//   );
// }
// export default AdminDashboard;
