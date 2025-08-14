const User = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // get all users except password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};
const deleteUser = async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
};

module.exports = { getUsers, resetUserPassword, deleteUser, updateUser };

