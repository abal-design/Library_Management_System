import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.png";



const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-lg">
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
  );
};

export default Signup;
