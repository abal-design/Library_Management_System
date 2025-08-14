import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = userData;
    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return false;
    }
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

// ...existing code...
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const { email, password } = userData;
    setLoading(true);
  
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token, role, user } = res.data;
    
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user._id); // <-- use _id instead of id
    
      // Redirect based on role (case-insensitive)
      if (role.toLowerCase() === "librarian") navigate("/admin/dashboard");
      else if (role.toLowerCase() === "borrower") navigate("/user/dashboard");
      else setErrorMessage("Unknown role: Access denied");
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMessage(
        err?.response?.data?.message || "Login failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="h-16" />
          <h2 className="mt-4 text-2xl font-bold text-blue-900">
            Login to Your Account
          </h2>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 border border-red-400 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border-2 border-blue-900 p-3 text-black rounded-xl"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            className="w-full border-2 border-blue-900 text-black p-3 rounded-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <div className="text-left mt-2">
          <button
            type="button"
            onClick={() => navigate("/forgot")}
            className="text-blue-700 hover:underline text-sm"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
