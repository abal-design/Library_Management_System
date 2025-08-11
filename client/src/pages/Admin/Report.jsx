import React from 'react'
import Logo from "../../assets/logo.png";
import { Link } from 'react-router-dom';
import {  MenuIcon} from '@heroicons/react/outline';

const ManageUser = () => {
      const handleLogout = () => {
  // example: remove token
  localStorage.removeItem('token');
  navigate('/login');
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
          <Link to="/register" className="hover:bg-blue-800 px-3 py-2 rounded">Add User</Link>
          <Link to="/admin/manage-book" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Books</Link>
          <Link to="/admin/manage-user" className="hover:bg-blue-800 px-3 py-2 rounded">Manage Users</Link>
          <Link to="/admin/reports" className="hover:bg-blue-800 bg-blue-800 active:bg-blue-800 px-3 py-2 rounded">Reports</Link>
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
              <h2 className="text-xl font-semibold text-blue-900">Admin Dashboard</h2>
            </div>
            <div className="text-sm text-gray-600 hidden md:block">Welcome back, Admin 👋</div>
          </header>
        </main>


      
    </div>
  )
}

export default ManageUser
