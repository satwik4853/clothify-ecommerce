import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import Loader from '../../components/common/Loader';

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-600',
};

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-white border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-sm flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="font-display font-black text-2xl text-primary">{value}</p>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{label}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await adminAPI.getStats();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      } catch {
        setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><Loader /></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FiPackage} label="Total Orders" value={stats?.totalOrders || 0} color="bg-blue-500" />
        <StatCard icon={FiShoppingBag} label="Products" value={stats?.totalProducts || 0} color="bg-purple-500" />
        <StatCard icon={FiUsers} label="Customers" value={stats?.totalUsers || 0} color="bg-teal-500" />
        <StatCard
          icon={FiDollarSign}
          label="Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`}
          color="bg-accent"
          sub="from fulfilled orders"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Add New Product', path: '/admin/products/add', color: 'bg-primary', emoji: '➕' },
          { label: 'View All Products', path: '/admin/products', color: 'bg-purple-600', emoji: '🛍️' },
          { label: 'Manage Orders', path: '/admin/orders', color: 'bg-blue-600', emoji: '📦' },
        ].map((a) => (
          <Link
            key={a.path}
            to={a.path}
            className={`${a.color} text-white p-4 flex items-center justify-between hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{a.emoji}</span>
              <span className="font-semibold text-sm">{a.label}</span>
            </div>
            <FiArrowRight size={16} />
          </Link>
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-white border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-display font-bold text-sm uppercase tracking-wider">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-primary font-semibold hover:text-accent transition-colors">
            View All →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold">₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
