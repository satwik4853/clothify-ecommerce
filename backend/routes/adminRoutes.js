const express = require('express');
const router = express.Router();
const {
  adminLogin, getDashboardStats, getAllOrders, updateOrderStatus, getAllUsers,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.get('/stats', protectAdmin, getDashboardStats);
router.get('/orders', protectAdmin, getAllOrders);
router.put('/orders/:id', protectAdmin, updateOrderStatus);
router.get('/users', protectAdmin, getAllUsers);

module.exports = router;
