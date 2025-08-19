import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      // Example: send form data to your backend API
      // await axios.post("/api/contact", formData);

      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Address</h2>
                <p className="text-gray-500"> Dulari-4, Morang, Nepal</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Email</h2>
                <p className="text-gray-500">themailofabal@gmail.com</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-700">Phone</h2>
                <p className="text-gray-500">+977 9746953529</p>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-black mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-black mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:text-black"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>

              {status && <p className="text-gray-700 mt-2">{status}</p>}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
