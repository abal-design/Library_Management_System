import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch dashboard stats + user info on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch dashboard stats
        const statsResponse = await axios.get("/api/reports/stats", config);
        setStats(statsResponse.data);

        // Fetch logged-in user info
        const userResponse = await axios.get("/api/auth/me", config);
        setUsername(userResponse.data.name);

      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
          <h1 className="text-2xl font-bold text-center mt-2">LMS Admin</h1>
        </div>
        <nav className="flex flex-col gap-4 p-6 flex-1">
          <Link
            to="/admin/dashboard"
            className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded"
          >
            Dashboard
          </Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">
            Add User
          </Link>
          <Link
            to="/admin/manage-book"
            className="hover:bg-blue-800 px-3 py-2 rounded"
          >
            Manage Books
          </Link>
          <Link
            to="/admin/manage-user"
            className="hover:bg-blue-800 px-3 py-2 rounded"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/reports"
            className="hover:bg-blue-800 px-3 py-2 rounded"
          >
            Reports
          </Link>
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
              <h2 className="text-xl font-semibold text-blue-900">
                Dashboard
              </h2>
              <p className="text-sm text-gray-600">
                Welcome back, <strong>{username || "Admin"}</strong> 👋
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600 hidden md:block">
            {currentTime.toLocaleString()}
          </div>
        </header>

        <div className="p-6 flex-1 overflow-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading dashboard stats...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded shadow text-center">
                <h3 className="text-xl font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded shadow text-center">
                <h3 className="text-xl font-semibold mb-2">Total Books</h3>
                <p className="text-3xl font-bold">{stats.totalBooks}</p>
              </div>
              <div className="bg-white p-6 rounded shadow text-center">
                <h3 className="text-xl font-semibold mb-2">Books Borrowed</h3>
                <p className="text-3xl font-bold">{stats.borrowedBooks}</p>
              </div>
            </div>
          )}
        </div>
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
