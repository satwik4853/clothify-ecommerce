const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById, updateOrderToPaid, cancelOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require auth

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
