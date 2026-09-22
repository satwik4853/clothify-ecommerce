import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Customer Pages
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminOrders from './pages/admin/AdminOrders';

// Protected Route wrappers
const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

// Layout wrapper for customer pages (with Navbar + Footer)
const CustomerLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── Customer Routes ── */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/men" element={<CustomerLayout><ProductListPage category="Men" /></CustomerLayout>} />
        <Route path="/women" element={<CustomerLayout><ProductListPage category="Women" /></CustomerLayout>} />
        <Route path="/kids" element={<CustomerLayout><ProductListPage category="Kids" /></CustomerLayout>} />
        <Route path="/products" element={<CustomerLayout><ProductListPage /></CustomerLayout>} />
        <Route path="/products/:id" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route path="/checkout" element={<PrivateRoute><CustomerLayout><CheckoutPage /></CustomerLayout></PrivateRoute>} />
        <Route path="/order-confirmation/:id" element={<PrivateRoute><CustomerLayout><OrderConfirmationPage /></CustomerLayout></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute><CustomerLayout><OrdersPage /></CustomerLayout></PrivateRoute>} />

        {/* ── Admin Routes ── */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
