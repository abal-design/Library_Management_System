import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline";
import axios from "axios";

const ManageUser = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get("/api/users", config);
        console.log("Users API response:", response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch users error:", err);
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    navigate(`/admin/edit-user/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove user from UI after successful deletion
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      alert("Failed to delete user. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
          <h1 className="text-2xl font-bold text-center mt-2">LMS Admin</h1>
        </div>
        <nav className="flex flex-col gap-4 p-6 flex-1">
          <Link to="/admin/dashboard" className="hover:bg-blue-800 px-3 py-2 rounded">
            Dashboard
          </Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">
            Add User
          </Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 px-3 py-2 rounded">
            Manage Books
          </Link>
          <Link
            to="/admin/manage-user"
            className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded"
          >
            Manage Users
          </Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Manage Users</h2>
          </div>
          <div className="text-sm text-gray-600 hidden md:block">Welcome back, Admin 👋</div>
        </header>

        <div className="p-6 flex-1 overflow-auto">
          {loading ? (
            <p className="text-center text-gray-600">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-600">No users found.</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr
                      key={user._id || idx}
                      className="border-b hover:bg-gray-100 transition"
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageUser;
