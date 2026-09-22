const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, getRelatedProducts,
  createProduct, updateProduct, deleteProduct,
  addReview, getAdminProducts,
} = require('../controllers/productController');
const { protect, protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/', getProducts);
router.get('/admin/all', protectAdmin, getAdminProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

// Customer
router.post('/:id/review', protect, addReview);

// Admin
router.post('/', protectAdmin, upload.array('images', 6), createProduct);
router.put('/:id', protectAdmin, upload.array('images', 6), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;
