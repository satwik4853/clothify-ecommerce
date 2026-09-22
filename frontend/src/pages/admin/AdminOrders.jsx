import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

const PLACEHOLDER = 'https://via.placeholder.com/40x50/f3f4f6/9ca3af?text=?';

function StatusDropdown({ orderId, currentStatus, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSelect = async (status) => {
    if (status === currentStatus) { setOpen(false); return; }
    setUpdating(true);
    setOpen(false);
    try {
      await adminAPI.updateOrder(orderId, { status });
      onUpdate(orderId, status);
      toast.success(`Order status → ${status}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={updating}
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[currentStatus] || 'bg-gray-100 text-gray-600'} disabled:opacity-60`}
      >
        {updating ? '...' : currentStatus}
        <FiChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg min-w-[140px] z-20 py-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-gray-50"
            >
              <span className={`font-semibold ${s === currentStatus ? 'text-primary' : 'text-gray-700'}`}>{s}</span>
              {s === currentStatus && <FiCheck size={11} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filterStatus) params.status = filterStatus;
      const { data } = await adminAPI.getOrders(params);
      setOrders(data.orders || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <AdminLayout title="Orders">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-xs font-bold text-gray-500 uppercase">Filter by status:</span>
        <div className="flex flex-wrap gap-2">
          {['', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`text-xs font-bold px-3 py-1.5 transition-all ${
                filterStatus === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s || 'All'} {!s && total > 0 ? `(${total})` : ''}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 py-16 text-center text-gray-400 text-sm">
          No orders found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-primary">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">{order.items?.length}</td>
                      <td className="px-4 py-3 font-semibold">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                          {order.paymentMethod} · {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown orderId={order._id} currentStatus={order.status} onUpdate={handleStatusUpdate} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-xs text-primary font-semibold">
                        {expanded === order._id ? '▲ Hide' : '▼ Details'}
                      </td>
                    </tr>

                    {/* Expanded order details */}
                    {expanded === order._id && (
                      <tr>
                        <td colSpan={8} className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            {/* Items */}
                            <div className="sm:col-span-2">
                              <p className="font-bold uppercase tracking-wider text-primary mb-2">Items</p>
                              <div className="space-y-2">
                                {order.items?.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-white p-2 border border-gray-200">
                                    <img src={item.image || PLACEHOLDER} alt={item.name}
                                      className="w-10 h-12 object-cover object-top bg-gray-100 flex-shrink-0"
                                      onError={(e) => { e.target.src = PLACEHOLDER; }} />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold line-clamp-1">{item.name}</p>
                                      <p className="text-gray-500">Size: {item.size} · Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping + summary */}
                            <div className="space-y-3">
                              <div>
                                <p className="font-bold uppercase tracking-wider text-primary mb-1">Shipping To</p>
                                <p className="font-semibold">{order.shippingAddress?.fullName}</p>
                                <p className="text-gray-500">{order.shippingAddress?.addressLine1}</p>
                                <p className="text-gray-500">
                                  {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
                                </p>
                                <p className="text-gray-500">📞 {order.shippingAddress?.phone}</p>
                              </div>
                              <div>
                                <p className="font-bold uppercase tracking-wider text-primary mb-1">Price Breakdown</p>
                                <div className="space-y-1 text-gray-600">
                                  <div className="flex justify-between"><span>Items</span><span>₹{order.itemsPrice?.toLocaleString('en-IN')}</span></div>
                                  <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
                                  <div className="flex justify-between font-bold text-primary border-t border-gray-200 pt-1"><span>Total</span><span>₹{order.totalPrice?.toLocaleString('en-IN')}</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 border text-sm disabled:opacity-40 hover:border-primary">← Prev</button>
          <span className="px-4 py-2 bg-primary text-white text-sm">{page} / {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
            className="px-4 py-2 border text-sm disabled:opacity-40 hover:border-primary">Next →</button>
        </div>
      )}
    </AdminLayout>
  );
}
