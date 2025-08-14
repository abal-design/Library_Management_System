const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // adjust path if needed

// Protect routes - check if user is logged in
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // attach user to req
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Authorize roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `User role ${req.user.role} not authorized` });
    }
    next();
  };
};

module.exports = { protect, authorize };
