import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otpData, setOtpData] = useState({ otp: ''  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtpData({ ...otpData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpData.otp) {
      return alert('Please enter the OTP');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verifyOtp', otpData);
      alert('OTP verified successfully');
      navigate('/ResetPassword'); // update this route to your actual reset password page
    } catch (error) {
      console.error(error);
      alert('Invalid or expired OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="h-16" />
          <h2 className="mt-4 text-2xl font-bold text-blue-900">Enter OTP</h2>
          <p className="mt-2 text-gray-600 text-center">Check your email and enter the OTP to proceed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
            required
            className="w-full border-2 border-blue-900 p-3 rounded-xl"
          />

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition"
          >
            VERIFY OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
