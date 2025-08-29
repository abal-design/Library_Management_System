import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "./Navbar";
import Footer from "./Footer";
import defaultAvatar from "../../assets/DefaultAvatar.png";

// Environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Load user info from localStorage instantly
  const name = localStorage.getItem("name") || "";
  const email = localStorage.getItem("email") || "";
  const role = localStorage.getItem("role") || "";
  const profilePicture = localStorage.getItem("profilePicture") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      setUser({ name, email, role, profilePicture });

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        // Fetch updated user info and borrow history from API
        const [userRes, borrowRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/auth/me`, config),
          axios.get(`${API_BASE_URL}/api/borrow/history`, config),
        ]);

        if (userRes.status === "fulfilled") {
          setUser(userRes.value.data);
        } else {
          console.error(
            "User API error:",
            userRes.reason?.response?.data || userRes.reason?.message
          );
          setError("Failed to load user data.");
        }

        if (borrowRes.status === "fulfilled") {
          setBorrowHistory(borrowRes.value.data);
        } else {
          console.error(
            "Borrow history API error:",
            borrowRes.reason?.response?.data || borrowRes.reason?.message
          );
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600 font-semibold">
        Loading...
      </div>
    );

  if (error)
    return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;

  return (
    <div className="flex flex-col bg-amber-50 min-h-screen">
      <Navbar />

      <div className="bg-white rounded-lg shadow-md h-100 p-6 w-full max-w-3xl mx-auto my-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={profilePicture || defaultAvatar}
            alt={user.name || "User"}
            className="h-24 w-24 rounded-full border-2 border-blue-900 object-cover mb-4"
            onError={(e) => (e.currentTarget.src = defaultAvatar)}
          />
          <h2 className="text-2xl text-gray-600 font-bold">Name: {name}</h2>
          <p className="text-gray-600">Email: {email}</p>
          <p className="text-gray-500 text-sm">Role: {role}</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
