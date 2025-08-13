import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AbalImage from "../../assets/Abal.jpg";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-gray-50 px-6 py-12">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About Our Library
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are more than just a collection of books — we are a vibrant
            community of readers, learners, and knowledge seekers. Our mission
            is to make learning accessible, enjoyable, and inspiring for
            everyone.
          </p>
        </div>

        {/* Mission, Vision, and Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-blue-600 mb-3">
              Our Mission
            </h2>
            <p className="text-gray-600">
              To provide easy access to books, resources, and technology that
              empower our community to learn, grow, and succeed.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-green-600 mb-3">
              Our Vision
            </h2>
            <p className="text-gray-600">
              To be a hub of knowledge and creativity, where everyone feels
              welcome to explore, discover, and share ideas.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-purple-600 mb-3">
              Our Values
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Inclusivity</li>
              <li>Lifelong Learning</li>
              <li>Innovation</li>
              <li>Community Engagement</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Example Team Member */}
            {[
              {
                name: "Abal Bohara",
                role: "Founder & Developer",
                img: `${AbalImage}`,
              },
              {
                name: "Priya Sharma",
                role: "Librarian",
                img: "https://via.placeholder.com/150",
              },
              {
                name: "Ravi Koirala",
                role: "Assistant Librarian",
                img: "https://via.placeholder.com/150",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
