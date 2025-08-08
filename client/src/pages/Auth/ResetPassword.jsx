import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.newPassword !== userData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const res = await axios.put('http://localhost:5000/api/auth/resetPassword', {
        password: userData.newPassword
      });

      alert("Password reset successfully");
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="h-16" />
          <h2 className="mt-4 text-2xl font-bold text-blue-900">Reset Your Password</h2>
          <p className="mt-2 text-gray-600 text-center">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-900 p-3 rounded-xl"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-900 p-3 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition"
          >
            RESET PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
