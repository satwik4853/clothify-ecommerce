# Clothify 👕

A full-stack clothing e-commerce website inspired by The Souled Store, built with React, Node.js, Express, and MongoDB.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Tailwind CSS 3, React Router v6        |
| Backend    | Node.js, Express.js                              |
| Database   | MongoDB (Mongoose ODM)                           |
| Auth       | JWT (separate flows for customers & admins)      |
| Uploads    | Multer (local) — swap Cloudinary credentials in `.env` |
| State      | React Context API (Auth + Cart)                  |

---

## Project Structure

```
Clothing/
├── backend/
│   ├── controllers/       # authController, adminController, productController, cartController, orderController
│   ├── middleware/        # authMiddleware (protect / protectAdmin), uploadMiddleware
│   ├── models/            # User, Admin, Product, Cart, Order
│   ├── routes/            # authRoutes, adminRoutes, productRoutes, cartRoutes, orderRoutes
│   ├── utils/             # db.js, generateToken.js, seed.js
│   ├── uploads/           # Local image uploads (auto-created)
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/common/   # Navbar, Footer, ProductCard, Loader, Breadcrumb, AdminLayout
    │   ├── context/             # AuthContext, CartContext
    │   ├── pages/               # All customer pages
    │   │   └── admin/           # All admin pages
    │   ├── services/            # api.js (axios layer)
    │   ├── App.js
    │   └── index.js
    ├── tailwind.config.js
    └── package.json
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- **npm** v8+

---

## Setup & Run

### 1. Clone / open the project

```bash
cd "c:\Users\pansa\OneDrive\Desktop\Clothing"
```

### 2. Configure the backend

Open `backend/.env` and update as needed:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/clothify
JWT_SECRET=clothify_super_secret_jwt_key_2024
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Install & start the backend

```bash
cd backend
npm install        # already done
npm run dev        # starts on http://localhost:5000
```

### 4. Seed the database

In a new terminal (backend must be running):

```bash
cd backend
npm run seed
```

This creates:
- **Admin** — `admin@clothify.in` / `admin123`
- **Customer** — `rahul@example.com` / `user1234`
- **20 products** across Men, Women, and Kids

### 5. Install & start the frontend

```bash
cd frontend
npm install        # already done
npm start          # starts on http://localhost:3000
```

---

## URLs

| Page                  | URL                                      |
|-----------------------|------------------------------------------|
| Home                  | http://localhost:3000/                   |
| Men's Collection      | http://localhost:3000/men                |
| Women's Collection    | http://localhost:3000/women              |
| Kids' Collection      | http://localhost:3000/kids               |
| Product Detail        | http://localhost:3000/products/:id       |
| Cart                  | http://localhost:3000/cart               |
| Checkout              | http://localhost:3000/checkout           |
| My Orders             | http://localhost:3000/my-orders          |
| Customer Login        | http://localhost:3000/login              |
| Customer Register     | http://localhost:3000/register           |
| **Admin Login**       | http://localhost:3000/admin/login        |
| **Admin Dashboard**   | http://localhost:3000/admin              |
| **Admin Products**    | http://localhost:3000/admin/products     |
| **Admin Orders**      | http://localhost:3000/admin/orders       |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Route                    | Access   | Description             |
|--------|--------------------------|----------|-------------------------|
| POST   | `/register`              | Public   | Register customer        |
| POST   | `/login`                 | Public   | Customer login           |
| GET    | `/profile`               | Private  | Get profile              |
| PUT    | `/profile`               | Private  | Update profile           |
| POST   | `/address`               | Private  | Add delivery address     |
| POST   | `/wishlist/:productId`   | Private  | Toggle wishlist          |

### Admin (`/api/admin`)
| Method | Route         | Access | Description          |
|--------|---------------|--------|----------------------|
| POST   | `/login`      | Public | Admin login          |
| GET    | `/stats`      | Admin  | Dashboard stats      |
| GET    | `/orders`     | Admin  | All orders (paged)   |
| PUT    | `/orders/:id` | Admin  | Update order status  |
| GET    | `/users`      | Admin  | All customers        |

### Products (`/api/products`)
| Method | Route            | Access  | Description                    |
|--------|------------------|---------|--------------------------------|
| GET    | `/`              | Public  | List products (filter/sort/page)|
| GET    | `/:id`           | Public  | Single product                 |
| GET    | `/:id/related`   | Public  | Related products               |
| POST   | `/:id/review`    | Private | Add review                     |
| GET    | `/admin/all`     | Admin   | All products (incl. inactive)  |
| POST   | `/`              | Admin   | Create product (multipart)     |
| PUT    | `/:id`           | Admin   | Update product                 |
| DELETE | `/:id`           | Admin   | Soft-delete product            |

### Cart (`/api/cart`)
| Method | Route      | Access  | Description       |
|--------|------------|---------|-------------------|
| GET    | `/`        | Private | Get cart          |
| POST   | `/`        | Private | Add item          |
| PUT    | `/:itemId` | Private | Update quantity   |
| DELETE | `/:itemId` | Private | Remove item       |
| DELETE | `/`        | Private | Clear cart        |

### Orders (`/api/orders`)
| Method | Route            | Access  | Description        |
|--------|------------------|---------|--------------------|
| POST   | `/`              | Private | Create order       |
| GET    | `/myorders`      | Private | My order history   |
| GET    | `/:id`           | Private | Order detail       |
| PUT    | `/:id/pay`       | Private | Mark paid          |
| PUT    | `/:id/cancel`    | Private | Cancel order       |

---

## Features

### Customer
- Hero carousel with auto-advance and touch navigation
- Category pages (Men / Women / Kids) with mega-dropdown navigation
- Product grid with filters (size, color, sub-category, price range), sort, and pagination
- Product detail with image gallery (hover zoom), size selector, quantity, Add to Cart / Buy Now
- Cart with live quantity updates and price summary
- 3-step checkout wizard (address → payment → review)
- Order confirmation with status timeline and estimated delivery
- Order history page
- Customer login / register with form validation and password strength meter

### Admin
- Separate admin login (role-based JWT)
- Dashboard with stats (orders, products, users, revenue) and recent orders
- Product management table with search, category filter, activate/deactivate, delete
- Add / Edit product form with sizes & stock matrix, color picker, image upload & preview
- Orders management with inline status dropdown and expandable order details

---

## Customization

### Replace placeholder images
The seeded products use `placehold.co` placeholder images. Replace them by:
1. Uploading real images through the Admin → Add/Edit Product form
2. Or updating the `images` arrays in `backend/utils/seed.js` with real URLs

### Enable Cloudinary uploads
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Fill in `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `backend/.env`
3. Update `backend/middleware/uploadMiddleware.js` to use `multer-storage-cloudinary`

### Enable online payments (Razorpay / Stripe)
- Add your payment gateway keys to `.env`
- Update `CheckoutPage.jsx` to call the gateway SDK on "Online Payment" selection
- Update `orderController.js` → `updateOrderToPaid` to verify payment signatures

---

## License

MIT — free to use and modify.
