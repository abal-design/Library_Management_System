import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/outline"; // example icon
import Logo from "../../assets/logo.png";

const BorrowRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/borrows/records", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching borrow requests:", err);
      setError("Failed to fetch borrow requests");
    } finally {
      setLoading(false);
    }
  };

  const [dateTime, setDateTime] = useState(new Date());

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // 🔹 Fixed handleAction
  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");

      let newStatus = "Pending"; // default
      if (action === "accept") {
        newStatus = "Borrowed";
      } else if (action === "decline") {
        newStatus = "Declined";
      } else if (action === "return") {
        newStatus = "Returned";
      }

      await axios.put(
        `http://localhost:5000/api/borrows/${id}`,   // ✅ use id from map
        { status: newStatus },                       // ✅ send correct status
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchRequests(); // Refresh after update
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      alert("Failed to update request.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
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

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Borrow Requests</h2>
          </div>
          <div className="text-sm text-gray-600">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>
        </header>

        {/* Right: CRUD Buttons */}
        <div className="flex gap-2 mt-2 p-4">
          <button
            onClick={() => navigate("/admin/manage-book")}
            className="bg-white text-gray-800 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            📖 View All
          </button>
          <button
            onClick={() => navigate("/admin/add-book")}
            className=" hover:bg-yellow-300 bg-white text-gray-800 px-3 py-1 rounded transition"
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
          <button
            onClick={() => navigate("/admin/borrow-page")}
            className="bg-gray-600 text-gray-100 hover:bg-yellow-300 px-3 py-1 rounded transition"
          >
            📥 Borrow Request
          </button>
        </div>

        {loading && <p>Loading requests...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && requests.length === 0 && (
          <p className="text-gray-600">No borrow requests found.</p>
        )}

        <div className="overflow-x-auto p-4">
          <table className="min-w-full bg-white border border-amber-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-amber-100 text-left text-gray-700">
                <th className="py-3 px-4 border-b">User</th>
                <th className="py-3 px-4 border-b">Book</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Submit Date</th>
                <th className="py-3 px-4 border-b">Fine</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-amber-50">
                  <td className="py-2 px-4 border-b"> {req.userId?.name}</td>
                  <td className="py-2 px-4 border-b"> {req.bookId?.title}</td>
                  <td className="py-2 px-4 border-b"> {new Date(req.borrowDate).toLocaleDateString()} </td>
                  <td className="py-2 px-4 border-b"> {req.borrowDate ? new Date(new Date(req.borrowDate).getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString() : "Not Set"} </td>
                  <td className="py-2 px-4 border-b"> {req.fine > 0 ? `Rs. ${req.fine}` : "No Fine"} </td>

                  <td className="py-2 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                        ${
                          req.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : req.status === "Borrowed"
                            ? "bg-green-100 text-green-800"
                            : req.status === "Declined"
                            ? "bg-red-100 text-red-800"
                            : req.status === "Returned"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {req.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req._id, "accept")}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(req._id, "decline")}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {req.status === "Borrowed" && (
                      <button
                        onClick={() => handleAction(req._id, "return")}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Mark Returned
                      </button>
                    )}
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

export default BorrowRequestsPage;
