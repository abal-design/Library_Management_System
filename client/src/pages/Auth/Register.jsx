import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import {  MenuIcon} from '@heroicons/react/outline';



const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role:''
  });
  const handleLogout = () => {
  // example: remove token
  localStorage.removeItem('token');
  navigate('/login');
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const [dateTime, setDateTime] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => setDateTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Signup successful! Please login.");
      navigate('/admin/dashboard/'); // Redirect to login after signup
    } catch (error) {
      console.error(error);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Header */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 ml-16 items-center" />
          <h1 className="text-2xl font-bold ml-9">LMS Admin</h1>
          
        </div>
        <nav className="flex flex-col gap-4 p-6">
          <Link to="/admin/dashboard" className="hover:bg-blue-800 px-3 py-2 rounded">Dashboard</Link>
          <Link to="/register" className="hover:bg-blue-800 bg-blue-800 active:bg-blue-800 px-3 py-2 rounded">Add User</Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Books</Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Users</Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">Reports</Link>
          <button
          onClick={handleLogout}
          className="bg-yellow-400 mb-3 fixed bottom-0 text-black px-4 py-2 rounded hover:bg-yellow-300 transition">
          Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
      {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Add User</h2>
          </div>
          <div className="text-sm text-gray-600">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>
        </header>


        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-10 rounded-xl justify-center shadow-md w-full max-w-lg">
            <div className="flex flex-col items-center mb-6">
              <img src={Logo} alt="Logo" className="h-16" />
              <h2 className="mt-4 text-2xl font-bold text-blue-900">Create New User Account</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-blue-900 p-3 rounded-xl"
                />

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-900 p-3 rounded-xl"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-900 p-3 rounded-xl"
              />

              <select
                name="role"
                onChange={handleChange}
                required
                className="w-full border-2 border-blue-900 p-3 rounded-xl bg-white text-gray-700"
              >
                <option value="">Select Role</option>
                <option value="Borrower">Borrower</option>
                <option value="Librarian">Librarian</option>
              </select>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition"
              >
                SIGN UP
              </button>
            </form>
          </div>

          
        </div>
      </main>
    </div>
  );
};

export default Signup;
