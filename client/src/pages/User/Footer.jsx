import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Links */}
        <nav className="flex gap-6 text-sm md:text-base">
          <a href="#" className="hover:text-yellow-400 transition">
            About Us
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            Contact
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            Jobs
          </a>
          <a href="#" className="hover:text-yellow-400 transition">
            Press Kit
          </a>
        </nav>

        
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} - All rights reserved by Library ManagementSystem
      </div>
    </footer>
  );
};

export default Footer;
