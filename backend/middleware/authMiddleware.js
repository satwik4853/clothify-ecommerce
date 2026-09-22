const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Protect customer routes
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    console.log('❌ No token found in request headers');
    res.status(401);
    throw new Error('Not authorized. Please log in to continue.');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      console.log('❌ User not found for token:', decoded.id);
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    res.status(401);
    throw new Error('Not authorized. Please log in again.');
  }
});

// Protect admin routes
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      res.status(401);
      throw new Error('Not authorized as admin');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

module.exports = { protect, protectAdmin };
