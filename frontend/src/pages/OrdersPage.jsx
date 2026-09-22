import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import Loader from '../components/common/Loader';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

const PLACEHOLDER = 'https://via.placeholder.com/56x70/f3f4f6/9ca3af?text=?';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-[900px] mx-auto px-4 lg:px-8 py-8">
      <h1 className="font-display font-black text-2xl text-primary uppercase mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="font-display font-bold text-xl text-primary mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-6">You haven't placed any orders. Start shopping!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Shop Now <FiChevronRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/order-confirmation/${order._id}`}
              className="block bg-white border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Order ID</p>
                  <p className="font-mono text-xs font-semibold text-primary">{order._id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Ordered on</p>
                    <p className="text-xs font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <FiChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                </div>
              </div>

              {/* Item thumbnails */}
              <div className="flex items-center gap-3">
                <div className="flex gap-2 flex-1 overflow-hidden">
                  {order.items.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item.image || PLACEHOLDER}
                      alt={item.name}
                      className="w-14 h-[70px] object-cover object-top bg-gray-100 flex-shrink-0"
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-[70px] bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  <p className="font-bold text-base text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
