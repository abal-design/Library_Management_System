const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpUtils = require("../utils/otpUtils");
const nodemailer = require("nodemailer");

// Generate JWT token including user id and role
const generateToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role },  // include role here
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
    const { email, password} = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user);
      res.json({ token, role: user.role, userId: user._id });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password controller
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "Email not found" });

    user.otp = otpUtils.generateOtp();
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${user.otp}. It expires in 10 minutes.`,
    });

    res.status(200).send({ message: "OTP sent", OTP: user.otp });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: err.message });
  }
};



//reset Password
const verifyAndResetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const user = await User.findOne({ otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (newPassword) {
      // Reset password flow
      user.password = await bcrypt.hash(newPassword, 10);
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      return res.status(200).json({ message: 'Password reset successful' });
    } else {
      // OTP verification only
      return res.status(200).json({ message: 'OTP verified successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


//reset Password
// const resetPassword = async (req, res) => {
//   try {
//     const { newPassword , otp } = req.body;

//     const user = await findUserByOtp(otp);
//     if (!user) {
//       return res.status(400).send({ message: "Invalid or expired OTP" });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await clearOtpFields(user);

//     res.status(200).send({ message: "Password reset successful" });
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };




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
module.exports = { register, login, forgotPassword, verifyOtp, verifyAndResetPassword};

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

