const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const path = require('path');

// @desc    Get all products with filters, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (req.query.category) filter.category = req.query.category;
  if (req.query.subCategory) filter.subCategory = { $in: req.query.subCategory.split(',') };
  if (req.query.color) filter['colors.name'] = { $in: req.query.color.split(',') };
  if (req.query.size) filter['sizes.size'] = { $in: req.query.size.split(',') };
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.featured === 'true') filter.isFeatured = true;

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    popular: { soldCount: -1 },
    rating: { rating: -1 },
  };
  const sort = sortMap[req.query.sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    subCategory: product.subCategory,
    isActive: true,
  }).limit(8);
  res.json({ success: true, products: related });
});

// @desc    Create product (admin)
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, description, price, discountPrice, category, subCategory,
    fit, fabric, sizes, colors, badge, isFeatured,
  } = req.body;

  // Handle uploaded images
  let images = [];
  if (req.files && req.files.length > 0) {
    images = req.files.map((f) => `/uploads/${f.filename}`);
  } else if (req.body.images) {
    images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
  }

  const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [];
  const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors || [];

  const product = await Product.create({
    name, description,
    price: Number(price),
    discountPrice: Number(discountPrice) || 0,
    category, subCategory,
    fit: fit || '',
    fabric: fabric || '',
    sizes: parsedSizes,
    colors: parsedColors,
    images,
    badge: badge || '',
    isFeatured: isFeatured === 'true' || isFeatured === true,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update product (admin)
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = ['name', 'description', 'price', 'discountPrice', 'category',
    'subCategory', 'fit', 'fabric', 'badge', 'isFeatured', 'isActive'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  if (req.body.sizes) {
    product.sizes = typeof req.body.sizes === 'string' ? JSON.parse(req.body.sizes) : req.body.sizes;
  }
  if (req.body.colors) {
    product.colors = typeof req.body.colors === 'string' ? JSON.parse(req.body.colors) : req.body.colors;
  }
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((f) => `/uploads/${f.filename}`);
    product.images = [...product.images, ...newImages];
  }

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Soft delete
  product.isActive = false;
  await product.save();
  res.json({ success: true, message: 'Product removed' });
});

// @desc    Add review
// @route   POST /api/products/:id/review
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  product.recalcRating();
  await product.save();
  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc    Get all products for admin (includes inactive)
// @route   GET /api/products/admin/all
// @access  Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, products, page, pages: Math.ceil(total / limit), total });
});

module.exports = {
  getProducts, getProductById, getRelatedProducts,
  createProduct, updateProduct, deleteProduct,
  addReview, getAdminProducts,
};
