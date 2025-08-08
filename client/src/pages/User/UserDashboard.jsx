import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import {
  BookOpenIcon,
  UsersIcon,
  ClipboardCheckIcon,
  ExclamationIcon,
  MenuIcon,
} from '@heroicons/react/outline';
import { Link } from 'react-router-dom';


const UserDashboard= () => {

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Header */}
      <aside className="w-64 bg-blue-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <img src={Logo} alt="Logo" className="h-16 ml-16 items-center" />
          <h1 className="text-2xl font-bold ml-9">LMS User</h1>
          
        </div>
        <nav className="flex flex-col gap-4 p-6">
          <Link to="#" className="hover:bg-blue-800 px-3 bg-blue-800 py-2 rounded">Dashboard</Link>
          <Link to="#" className="hover:bg-blue-800 px-3 py-2 rounded">BookLibrary</Link>
          <Link to="#" className="hover:bg-blue-800 px-3 py-2 rounded">ReturnBook</Link>
          <button
          onClick={handleLogout}
          className="bg-yellow-400 mb-3 fixed bottom-0 text-black px-4 py-2 rounded hover:bg-yellow-300 transition">
          Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIcon className="h-6 w-6 text-blue-900 md:hidden" />
            <h2 className="text-xl font-semibold text-blue-900">User Dashboard</h2>
          </div>
          <div className="text-sm text-gray-600 hidden md:block">Welcome back, User 👋</div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-blue-900 mb-4">Welcome, User!</h2>

          {/* Borrowed Books Section */}
          <section className="bg-white shadow-md rounded-lg p-6 mt-4">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Your Borrowed Books</h3>
            {/* Placeholder for now */}
            <p className="text-gray-600">You have not borrowed any books yet.</p>
          </section>

          {/* Profile Information */}
          <section className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 className="text-xl font-bold text-blue-800 mb-2">Profile Information</h3>
            <ul className="text-gray-700">
              <li><strong>Name:</strong> John Doe</li>
              <li><strong>Email:</strong> johndoe@example.com</li>
              <li><strong>Role:</strong> User</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-auto text-center py-4 text-sm bg-gray-900 text-white">
          &copy; 2025 Library Management System | User Panel
        </footer>
      </main>
    </div>
  );
}
export default UserDashboard;
