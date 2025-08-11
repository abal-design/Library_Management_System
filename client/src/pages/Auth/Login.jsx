import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  // Validate email and password before sending
  const validateForm = () => {
    const { email, password } = userData;
    if (!email || !password) {
      alert('Please fill all fields.');
      return false;
    }
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', userData);

      const { token, role } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      alert('Login successful');

      // Redirect based on user role
      if (role === 'Librarian') {
        navigate('/admin/dashboard');
      } else if (role === 'Borrower') {
        navigate('/user/dashboard');
      } else {
        alert('Unknown role: Access denied');
      }

    } catch (err) {
      console.error('Login Error:', err);
      alert(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="h-16" />
          <h2 className="mt-4 text-2xl font-bold text-blue-900">Login to Your Account</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-900 p-3 rounded-xl"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-900 p-3 rounded-xl"
          />

          {/* Forgot Password Button
          <div className="text-left mt-2">
            <button
              type="button"
              onClick={() => navigate("/forgot")}
              className="text-blue-700 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div> */}

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
