import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react"; // nice lock icon

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-10 max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 p-4 rounded-full">
            <Lock className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3">Access Denied</h1>
        <p className="text-lg text-gray-200 mb-6">
          🚫 You do not have permission to view this page.  
          Please return to the login page or contact an Organizer.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition"
        >
          Go Back to Login
        </button>
      </div>
    </div>
  );
};

export default NotFound;
