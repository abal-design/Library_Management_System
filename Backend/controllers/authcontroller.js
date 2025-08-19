const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpUtils = require("../utils/otpUtils");
const nodemailer = require("nodemailer");

// JWT token including user id and role for Details
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },  // includes role
    process.env.JWT_SECRET, 
    { expiresIn: '30d' }
  );

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});


const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Register request:", { name, email, role });  // Debug

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    if (role === 'Borrower') {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Welcome to Library Management System',
          text: `Hello ${name},\n\nYour borrower account has been created.\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nThank you.`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Registration email sent to Borrower:", email);
      } catch (mailError) {
        console.error("Error sending registration email:", mailError);
        // Optionally, you could still respond with success but mention mail failed
      }
    }

    const token = generateToken(user);

    res.status(201).json({ token, role: user.role, userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role,  },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      role: user.role,
      
      user: {
        name: user.name, 
        role: user.role,
        profilePicture: user.profilePicture, // assuming you have this field
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};




// const login = async (req, res) => {
//   try {
//     const { email, password} = req.body;
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       const token = generateToken(user);
//       res.json({ token, role: user.role, userId: user._id });
//     } else {
//       res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// resetUserPassword controller
const resetUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'User ID and new password are required' });
    }

    // Find the target user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: `Password for ${user.email} has been reset successfully.` });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};







//verified Otp
const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });

  }
  
  try {
    const user = await User.findOne({ otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }


    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}





const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body; // adjust fields as needed

    // Find and update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true, runValidators: true, select: "-password -otp -otpExpires" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { register, login, resetUserPassword, verifyOtp, getMe, updateUserProfile};

// const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     console.log("Register request:", { name, email, role });  // Debug

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: 'All fields required' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: 'Email already exists' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed, role });

//     if (role === 'Borrower') {
//       try {
//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: 'Welcome to Library Management System',
//           text: `Hello ${name},\n\nYour borrower account has been created.\n\nLogin Details:\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nThank you.`,
//         };

//         await transporter.sendMail(mailOptions);
//         console.log("Registration email sent to Borrower:", email);
//       } catch (mailError) {
//         console.error("Error sending registration email:", mailError);
//         // Optionally, you could still respond with success but mention mail failed
//       }
//     }

//     const token = generateToken(user);

//     res.status(201).json({ token, role: user.role, userId: user._id });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

