const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Men', 'Women', 'Kids'],
    },
    subCategory: {
      type: String,
      required: [true, 'Sub-category is required'],
      // e.g. T-Shirts, Hoodies, Shirts, Polos, Joggers, Dresses, Tops, Jeans
    },
    fit: {
      type: String,
      default: '',
      // e.g. Oversized Fit, Classic Fit, Slim Fit, Relaxed Fit
    },
    fabric: {
      type: String,
      default: '',
    },
    colors: [
      {
        name: String,
        hex: String,
        images: [String], // URLs (local path or Cloudinary URL)
      },
    ],
    sizes: [
      {
        size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXS'] },
        stock: { type: Number, default: 0 },
      },
    ],
    images: [String], // Primary images array
    badge: {
      type: String,
      default: '',
      // e.g. 'NEW', 'TRENDING', 'SALE', 'PREMIUM HEAVY GAUGE FABRIC'
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual: total stock across all sizes
productSchema.virtual('totalStock').get(function () {
  return this.sizes.reduce((acc, s) => acc + s.stock, 0);
});

// Recalculate average rating on review changes
productSchema.methods.recalcRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
