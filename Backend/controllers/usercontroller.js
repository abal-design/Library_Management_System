const User = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // get all users except password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {getUsers}
