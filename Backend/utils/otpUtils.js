const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const findUserByOtp = async (otp) =>
  await User.findOne({ otp, otpExpires: { $gt: Date.now() } }).select("+password");

const clearOtpFields = async (user) => {
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
};

module.exports = { generateOtp, findUserByOtp, clearOtpFields };