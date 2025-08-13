const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // <--- add this line to import your User schema/model
const { getMe, updateUserProfile } = require("../controllers/authcontroller");
const { protect } = require('../middleware/authMiddleware');


router.get('/me', protect, async (req, res) => {
  console.log("Protect middleware output:", req.user);
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// GET all users
// router.get('/users', async (req, res) => {
//   try {
//     const users = await User.find({}, '-password -otp -otpExpires');
//     res.json(users);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.get('/me', protect, getMe);
router.put('/me', protect, updateUserProfile);

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
