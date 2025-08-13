import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Menu as MenuIcon } from 'lucide-react';
import Logo from '../../assets/logo.png';

const ResetUserPassword = () => {
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(new Date());

  const [formData, setFormData] = useState({
    email: '',
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { email, newPassword } = formData;
    if (!email || !newPassword) {
      alert('Please fill all fields.');
      return false;
    }
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token'); // admin token
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put('/api/users/reset-password', formData, config);
      alert('Password updated successfully!');
      navigate('/admin/manage-user'); // redirect to user management
    } catch (err) {
      console.error('Reset Error:', err);
      alert(err?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 mx-auto" />
          <h1 className="text-2xl font-bold text-center">LMS Admin</h1>
        </div>
        <nav className="flex flex-col gap-4 p-6 flex-1">
          <Link to="/admin/dashboard" className="hover:bg-blue-800 px-3 py-2 rounded">Dashboard</Link>
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">Add User</Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Books</Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Users</Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 px-3 py-2 rounded">Reports</Link>
          <Link to="/admin/reset-password" className="hover:bg-blue-800 bg-blue-800 px-3 py-2 rounded">Reset User Password</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">Reset User Password</h2>
          </div>
          <div className="text-sm text-gray-600">
            {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}
          </div>
        </header>

        {/* Reset Form */}
        <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md mx-auto my-10">
          <div className="flex flex-col items-center mb-6">
            <img src={Logo} alt="Logo" className="h-16" />
            <h2 className="mt-4 text-2xl font-bold text-blue-900">Reset User Password</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="User Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-2 text-black border-blue-900 p-3 rounded-xl"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full border-2 text-black border-blue-900 p-3 rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetUserPassword;
