const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const userRoutes = require("./routes/userRoutes"); // import your user model
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes


app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api', userRoutes);

// Global error handler
app.use(errorHandler);




// Start server and create default admin after DB connection
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
});
