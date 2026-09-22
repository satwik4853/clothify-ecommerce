import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheck, FiPackage, FiArrowRight } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import Loader from '../components/common/Loader';

const PLACEHOLDER = 'https://via.placeholder.com/60x75/f3f4f6/9ca3af?text=?';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function StatusBar({ status }) {
  const current = STATUS_STEPS.indexOf(status);
  if (status === 'Cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold text-center py-3 rounded-sm">
        ❌ Order Cancelled
      </div>
    );
  }
  return (
    <div className="flex items-center">
      {STATUS_STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < current ? 'bg-green-500 text-white' : i === current ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i < current ? <FiCheck size={13} /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold text-center hidden sm:block ${i === current ? 'text-primary' : 'text-gray-400'}`}>
              {s}
            </span>
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${i < current ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getById(id);
        setOrder(data.order);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader />;
  if (!order) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Order not found.</p>
      <Link to="/my-orders" className="btn-primary mt-4 inline-block">My Orders</Link>
    </div>
  );

  return (
    <div className="max-w-[800px] mx-auto px-4 lg:px-8 py-10">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FiCheck size={28} className="text-white" />
        </div>
        <h1 className="font-display font-black text-3xl text-primary mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm">
          Thank you for shopping with Clothify. Your order has been placed successfully.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-sm">
          <FiPackage size={14} className="text-primary" />
          <span className="text-sm font-semibold text-primary">Order ID: {order._id}</span>
        </div>
      </div>

      {/* Order status */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
          Order Status
        </h2>
        <StatusBar status={order.status} />
        {order.estimatedDelivery && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Estimated Delivery: <strong>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </p>
        )}
      </div>

      {/* Order items */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <h2 className="font-display font-bold text-sm uppercase tracking-widest mb-4 pb-3 border-b border-gray-200">
          Items Ordered
        </h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-4 items-center">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.name}
                className="w-14 h-18 object-cover object-top bg-gray-100 flex-shrink-0"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two column: address + payment summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 pb-2 border-b border-gray-200">
            Delivery Address
          </h3>
          <p className="font-semibold text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600 mt-1">
            {order.shippingAddress.addressLine1}
            {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
          </p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
          </p>
          <p className="text-sm text-gray-600">📞 {order.shippingAddress.phone}</p>
        </div>

        <div className="bg-white border border-gray-200 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 pb-2 border-b border-gray-200">
            Price Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Items</span>
              <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className={order.shippingPrice === 0 ? 'text-green-600 font-semibold' : ''}>
                {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-200">
              <span>Total Paid</span>
              <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              Payment: {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/my-orders" className="btn-secondary flex-1 text-center flex items-center justify-center gap-2">
          <FiPackage size={15} /> Track Orders
        </Link>
        <Link to="/products" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
          Continue Shopping <FiArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
