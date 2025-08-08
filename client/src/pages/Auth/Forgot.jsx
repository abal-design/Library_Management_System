import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: ''
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
    if (!userData.email) {
      return alert('Please enter your email.');
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgotPassword', userData);
      alert(`OTP sent to ${userData.email}`);
      navigate('/otp');
    } catch (err) {
      console.error(err);
      alert('Failed to send OTP. Please check your email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="h-16" />
          <h2 className="mt-4 text-2xl font-bold text-blue-900">Reset Your Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-900 p-3 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition"
          >
            SEND OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
