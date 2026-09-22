const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const generateToken = require('../utils/generateToken');

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      success: true,
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalUsers, recentOrders] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
  ]);

  const revenue = await Order.aggregate([
    { $match: { status: { $in: ['Delivered', 'Processing', 'Shipped'] } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenue[0]?.total || 0,
    },
    recentOrders,
  });
});

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone'),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    orders,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status || order.status;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  if (req.body.status === 'Delivered') order.deliveredAt = Date.now();

  const updated = await order.save();
  res.json({ success: true, order: updated });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

module.exports = { adminLogin, getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers };
