// filepath: d:\MERN Stack\Library_Management_System\Backend\config\db.js
const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI; // Make sure this is set
  if (!uri) {
    throw new Error('MongoDB URI is not defined in environment variables');
  }
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
};

module.exports = connectDB;