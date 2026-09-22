import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const PLACEHOLDER = 'https://via.placeholder.com/100x125/f3f4f6/9ca3af?text=?';

export default function CartPage() {
  const { cart, loading, cartCount, cartSubtotal, shippingPrice, cartTotal, updateItem, removeItem } = useCart();
  const { isAuth } = useAuth();
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-20 text-center">
        <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="font-display font-black text-2xl text-primary mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Start Shopping <FiArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
      <h1 className="font-display font-black text-2xl lg:text-3xl text-primary uppercase mb-6">
        Shopping Cart <span className="text-gray-400 font-normal text-xl">({cartCount} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Cart items ── */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item._id} className="flex gap-4 bg-white border border-gray-200 p-4">
              {/* Image */}
              <Link to={`/products/${item.product?._id || item.product}`} className="flex-shrink-0 w-24 h-32 overflow-hidden bg-gray-100">
                <img
                  src={item.image || PLACEHOLDER}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/products/${item.product?._id || item.product}`}
                      className="font-semibold text-sm text-primary hover:text-accent line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-500">Size: <b>{item.size}</b></span>
                      {item.color && <span className="text-xs text-gray-500">Color: <b>{item.color}</b></span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity stepper */}
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateItem(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item._id, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-base text-primary">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products" className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:text-accent transition-colors mt-2">
            ← Continue Shopping
          </Link>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 p-6 sticky top-24">
            <h2 className="font-display font-bold text-base uppercase tracking-wider mb-5 pb-3 border-b border-gray-200">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                <span className="font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              {shippingPrice > 0 && (
                <p className="text-xs text-gray-400">
                  Add ₹{(999 - cartSubtotal).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-white px-4 py-2 text-xs font-bold uppercase hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>

            <button
              onClick={() => isAuth ? navigate('/checkout') : navigate('/login')}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {isAuth ? 'Proceed to Checkout' : 'Login to Checkout'}
              <FiArrowRight size={16} />
            </button>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
              {['VISA', 'MC', 'UPI', 'COD'].map((p) => (
                <span key={p} className="border border-gray-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
