const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // <--- add this line to import your User schema/model
const { getMe } = require("../controllers/authcontroller");
const { protect } = require('../middleware/authMiddleware');

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password -otp -otpExpires');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/auth/me", protect, getMe);
module.exports = router;



// const express = require("express");
// const router = express.Router();
// // const { getUsers } = require("../controllers/usercontroller");

// // Protect this route with auth middleware if needed
// // GET all users
// router.get('/users', async (req, res) => {
//   try {
//     const users = await User.find({}, '-password -otp -otpExpires'); // exclude sensitive fields
//     res.json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
