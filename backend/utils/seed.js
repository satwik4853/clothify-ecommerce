/**
 * Clothify – Seed Script
 * Run: npm run seed  (from /backend directory)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const SIZES_FULL = [
  { size: 'XS', stock: 15 }, { size: 'S', stock: 30 }, { size: 'M', stock: 50 },
  { size: 'L', stock: 45 }, { size: 'XL', stock: 35 }, { size: 'XXL', stock: 20 },
];
const SIZES_LIMITED = [
  { size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 3 }, { size: 'XL', stock: 0 },
];
const SIZES_KIDS = [
  { size: 'XS', stock: 20 }, { size: 'S', stock: 25 }, { size: 'M', stock: 20 }, { size: 'L', stock: 10 },
];

// Full-body / clothing-focused Unsplash photos
// crop=entropy focuses on the most interesting area (clothing)
const U = (id, crop = 'center') =>
  `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop&crop=${crop}&q=85`;

// Local images helper
const IMG = (filename) => `/uploads/products/${filename}`;

const PRODUCTS = [
  /* ══ MEN ══════════════════════════════════════════════════════════ */
  {
    name: 'Classic Oversized T-Shirt',
    description: 'A timeless crew-neck tee in a relaxed oversized silhouette. Made from 100% ring-spun cotton for all-day comfort. Perfect for everyday wear, layering, or casual outings.',
    price: 999, discountPrice: 799,
    category: 'Men', subCategory: 'T-Shirts',
    fit: 'Oversized Fit', fabric: '100% Ring-Spun Cotton, 180 GSM',
    badge: 'BESTSELLER', isFeatured: true,
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#f5f5f5' }, { name: 'Navy', hex: '#1d3557' }],
    sizes: SIZES_FULL,
    images: [
      IMG('men-tshirt-1.jpg'),
      IMG('men-tshirt-1.jpg'),
    ],
    soldCount: 1240,
  },
  {
    name: 'Premium Oxford Button-Down Shirt',
    description: 'Crafted from premium oxford fabric, this shirt transitions seamlessly from office to evening. Features a regular collar, chest pocket, and clean finish.',
    price: 1499, discountPrice: 1199,
    category: 'Men', subCategory: 'Shirts',
    fit: 'Classic Fit', fabric: 'Oxford Cotton Blend',
    badge: 'PREMIUM', isFeatured: true,
    colors: [{ name: 'Teal', hex: '#2a6b7c' }, { name: 'White', hex: '#f5f5f5' }],
    sizes: SIZES_FULL,
    images: [
      IMG('men-shirt-2.jpg'),
      IMG('men-shirt-2.jpg'),
    ],
    soldCount: 820,
  },
  {
    name: 'Fleece Pullover Hoodie',
    description: 'Stay warm in this midweight fleece hoodie. Double-layered hood, front kangaroo pocket, and ribbed cuffs. A wardrobe essential for every season.',
    price: 1899, discountPrice: 1499,
    category: 'Men', subCategory: 'Hoodies',
    fit: 'Relaxed Fit', fabric: 'Premium Heavy Fleece, 320 GSM',
    badge: 'TRENDING', isFeatured: true,
    colors: [{ name: 'Charcoal', hex: '#36454f' }, { name: 'Maroon', hex: '#800000' }],
    sizes: SIZES_FULL,
    images: [
      IMG('men-hoodie-1.jpg'),
      IMG('men-hoodie-1.jpg'),
    ],
    soldCount: 960,
  },
  {
    name: 'Slim Fit Polo T-Shirt',
    description: 'The go-to polo for smart casual dressing. Pique cotton fabric, two-button placket, and ribbed collar. Versatile for brunch, sports, or casual Friday.',
    price: 1099, discountPrice: 0,
    category: 'Men', subCategory: 'Polos',
    fit: 'Slim Fit', fabric: 'Pique Cotton, 220 GSM',
    badge: '', isFeatured: false,
    colors: [{ name: 'Dark Green', hex: '#228b22' }, { name: 'Navy', hex: '#1d3557' }],
    sizes: SIZES_FULL,
    images: [
      IMG('men-polo-1.jpg'),
      IMG('men-polo-1.jpg'),
    ],
    soldCount: 540,
  },
  {
    name: 'Athletic Jogger Pants',
    description: 'Engineered for movement and style. Tapered fit with elastic waistband, side pockets, and zip-ankled cuffs. From gym sessions to street style.',
    price: 1299, discountPrice: 999,
    category: 'Men', subCategory: 'Joggers',
    fit: 'Tapered Fit', fabric: 'Cotton-Polyester Blend',
    badge: 'NEW', isFeatured: false,
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Grey', hex: '#9ca3af' }],
    sizes: SIZES_FULL,
    images: [
      IMG('men-jogger-1.jpg'),
      IMG('men-jogger-1.jpg'),
    ],
    soldCount: 670,
  },
  {
    name: 'Bomber Jacket',
    description: 'Street-ready bomber jacket with satin finish, ribbed collar, cuffs and hem. Two side pockets and one interior pocket. Lightweight and stylish.',
    price: 2999, discountPrice: 2499,
    category: 'Men', subCategory: 'Jackets',
    fit: 'Regular Fit', fabric: 'Satin Polyester with Quilted Lining',
    badge: 'PREMIUM', isFeatured: true,
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Olive', hex: '#708238' }],
    sizes: SIZES_FULL,
    images: [
      IMG('men-jacket-1.jpg'),
      IMG('men-jacket-1.jpg'),
    ],
    soldCount: 310,
  },
  {
    name: 'Linen Casual Shirt',
    description: 'Lightweight linen shirt perfect for warm weather. Breathable fabric, relaxed collar, and rolled-up sleeve styling. A summer wardrobe must-have.',
    price: 1349, discountPrice: 1099,
    category: 'Men', subCategory: 'Shirts',
    fit: 'Relaxed Fit', fabric: '100% Linen',
    badge: 'SUMMER EDIT', isFeatured: false,
    colors: [{ name: 'Beige', hex: '#d4b896' }, { name: 'White', hex: '#f5f5f5' }],
    sizes: SIZES_FULL,
    images: [
      IMG('men-shirt-2.jpg'),
      IMG('men-shirt-2.jpg'),
    ],
    soldCount: 445,
  },
  {
    name: 'Cargo Shorts',
    description: 'Six-pocket cargo shorts made from durable cotton twill. Ideal for hikes, trips, or weekend errands.',
    price: 1199, discountPrice: 0,
    category: 'Men', subCategory: 'Shorts',
    fit: 'Regular Fit', fabric: '100% Cotton Twill',
    badge: '', isFeatured: false,
    colors: [{ name: 'Khaki', hex: '#c3b091' }, { name: 'Olive', hex: '#708238' }],
    sizes: SIZES_LIMITED,
    images: [
      IMG('men-tshirt-1.jpg'),
      IMG('men-tshirt-1.jpg'),
    ],
    soldCount: 390,
  },

  /* ══ WOMEN ═════════════════════════════════════════════════════ */
  {
    name: 'Women\'s Oversized Graphic Tee',
    description: 'Soft, breathable, and effortlessly cool. Relaxed crew-neck cut. A canvas for bold prints and self-expression.',
    price: 799, discountPrice: 649,
    category: 'Women', subCategory: 'T-Shirts',
    fit: 'Relaxed Fit', fabric: '100% Combed Cotton, 160 GSM',
    badge: 'TRENDING', isFeatured: true,
    colors: [{ name: 'White', hex: '#f5f5f5' }, { name: 'Lavender', hex: '#e6e0f5' }],
    sizes: SIZES_FULL,
    images: [
      IMG('women-tshirt-1.jpg'),
      IMG('women-tshirt-1.jpg'),
    ],
    soldCount: 1100,
  },
  {
    name: 'Striped Crop Top',
    description: 'Fashion-forward crop top with classic stripes. Pairs perfectly with high-waisted jeans or skirts.',
    price: 1099, discountPrice: 899,
    category: 'Women', subCategory: 'Tops',
    fit: 'Crop Fit', fabric: 'Premium Flat Knit Fabric',
    badge: 'NEW', isFeatured: true,
    colors: [{ name: 'Black & White', hex: '#333333' }, { name: 'Navy & White', hex: '#1d3557' }],
    sizes: SIZES_FULL,
    images: [
      IMG('women-tshirt-1.jpg'),
      IMG('women-tshirt-1.jpg'),
    ],
    soldCount: 780,
  },
  {
    name: 'Floral Wrap Midi Dress',
    description: 'Elegant wrap dress with a delicate floral print. V-neckline, tie waist, and midi length for a flattering silhouette.',
    price: 1999, discountPrice: 1599,
    category: 'Women', subCategory: 'Dresses',
    fit: 'Wrap Fit', fabric: 'Viscose Crepe',
    badge: 'PREMIUM', isFeatured: true,
    colors: [{ name: 'Rose Red', hex: '#c0392b' }, { name: 'Dusty Blue', hex: '#7995b0' }],
    sizes: SIZES_FULL,
    images: [
      IMG('women-dress-1.jpg'),
      IMG('women-dress-1.jpg'),
    ],
    soldCount: 620,
  },
  {
    name: 'Oversized Knit Sweater',
    description: 'Cozy and chic chunky knit sweater. Dropped shoulders, ribbed cuffs and hem. Style with leggings or denim.',
    price: 2199, discountPrice: 1799,
    category: 'Women', subCategory: 'Hoodies',
    fit: 'Oversized Fit', fabric: 'Premium Heavy Knit',
    badge: '', isFeatured: false,
    colors: [{ name: 'Cream', hex: '#fff8e7' }, { name: 'Burgundy', hex: '#800020' }],
    sizes: SIZES_FULL,
    images: [
      IMG('women-sweater-1.jpg'),
      IMG('women-sweater-1.jpg'),
    ],
    soldCount: 450,
  },
  {
    name: 'High-Waist Jogger Pants',
    description: 'Elevated athleisure with high-waist fit. Soft fabric, wide waistband, tapered leg, side pockets.',
    price: 1399, discountPrice: 1099,
    category: 'Women', subCategory: 'Joggers',
    fit: 'High-Waist Tapered', fabric: 'Cotton-Modal Blend',
    badge: 'BESTSELLER', isFeatured: false,
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Blush Pink', hex: '#ffb6c1' }],
    sizes: SIZES_FULL,
    images: [
      IMG('women-jogger-1.jpg'),
      IMG('women-jogger-1.jpg'),
    ],
    soldCount: 890,
  },
  {
    name: 'Pleated Mini Skirt',
    description: 'Modern take on a classic silhouette. Pairs with tees, blouses, or oversized hoodies.',
    price: 999, discountPrice: 799,
    category: 'Women', subCategory: 'Skirts',
    fit: 'A-Line', fabric: 'Polyester Crepe',
    badge: 'NEW', isFeatured: false,
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Cream', hex: '#fff8e7' }],
    sizes: SIZES_FULL,
    images: [
      IMG('women-dress-1.jpg'),
      IMG('women-dress-1.jpg'),
    ],
    soldCount: 560,
  },
  {
    name: 'Women\'s Denim Jacket',
    description: 'Classic denim jacket updated with a modern fit. Chest pockets, button closure, sturdy denim construction.',
    price: 2499, discountPrice: 0,
    category: 'Women', subCategory: 'Jackets',
    fit: 'Classic Fit', fabric: 'Stonewashed Denim',
    badge: '', isFeatured: false,
    colors: [{ name: 'Light Blue', hex: '#add8e6' }, { name: 'Dark Blue', hex: '#00008b' }],
    sizes: SIZES_LIMITED,
    images: [
      IMG('women-tshirt-1.jpg'),
      IMG('women-tshirt-1.jpg'),
    ],
    soldCount: 270,
  },

  /* ══ KIDS ══════════════════════════════════════════════════════ */
  {
    name: 'Kids\' Dinosaur Print T-Shirt',
    description: 'Fun dinosaur print tee in super-soft cotton. Gentle on sensitive skin. Machine washable and durable.',
    price: 599, discountPrice: 499,
    category: 'Kids', subCategory: 'T-Shirts',
    fit: 'Regular Fit', fabric: '100% Soft Cotton, 150 GSM',
    badge: 'KIDS\' FAV', isFeatured: false,
    colors: [{ name: 'Green', hex: '#2a9d8f' }, { name: 'Orange', hex: '#f4a261' }],
    sizes: SIZES_KIDS,
    images: [
      IMG('kids-tshirt-1.jpg'),
      IMG('kids-tshirt-1.jpg'),
    ],
    soldCount: 420,
  },
  {
    name: 'Kids\' Tracksuit Set',
    description: 'Matching top and trouser set in soft fleece. Elastic waistband, ribbed cuffs, zip-up jacket.',
    price: 1299, discountPrice: 999,
    category: 'Kids', subCategory: 'Sets',
    fit: 'Regular Fit', fabric: 'Soft Fleece Blend',
    badge: 'NEW', isFeatured: true,
    colors: [{ name: 'Navy', hex: '#1d3557' }, { name: 'Red', hex: '#e63946' }],
    sizes: SIZES_KIDS,
    images: [
      IMG('kids-set-1.jpg'),
      IMG('kids-set-1.jpg'),
    ],
    soldCount: 330,
  },
  {
    name: 'Kids\' Zip-Up Hoodie',
    description: 'Warm zip-up hoodie with soft inner lining, front pockets, and full-length zip. Great for school or outdoor play.',
    price: 1199, discountPrice: 949,
    category: 'Kids', subCategory: 'Hoodies',
    fit: 'Regular Fit', fabric: 'Cotton-Polyester Fleece',
    badge: 'TRENDING', isFeatured: false,
    colors: [{ name: 'Grey', hex: '#9ca3af' }, { name: 'Teal', hex: '#2a9d8f' }],
    sizes: SIZES_KIDS,
    images: [
      IMG('kids-tshirt-1.jpg'),
      IMG('kids-tshirt-1.jpg'),
    ],
    soldCount: 290,
  },
];

/* ══════════════════════════════════════════════════════════════════
   Seed function
══════════════════════════════════════════════════════════════════ */
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Admin.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    await Admin.create({
      name: 'Clothify Admin',
      email: 'admin@clothify.in',
      password: 'admin123',
      role: 'superadmin',
    });
    console.log('👤 Admin created: admin@clothify.in  |  password: admin123');

    await User.insertMany([
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'user1234' },
      { name: 'Priya Mehta', email: 'priya@example.com', password: 'user1234' },
    ]);
    console.log('👥 Users created  |  password: user1234');

    const products = await Product.insertMany(PRODUCTS);
    console.log(`🛍️  ${products.length} products seeded`);

    console.log('\n════════════════════════════════════════');
    console.log('🎉  Seed complete!');
    console.log('  Admin:     admin@clothify.in  /  admin123');
    console.log('  Customer:  rahul@example.com  /  user1234');
    console.log(`  Products:  ${products.length} items (Men / Women / Kids)`);
    console.log('════════════════════════════════════════\n');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();
