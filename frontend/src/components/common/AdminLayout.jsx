import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiMenu, FiX,
  FiLogOut, FiPlusSquare, FiChevronRight,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: FiGrid },
  { label: 'Products', path: '/admin/products', icon: FiShoppingBag },
  { label: 'Add Product', path: '/admin/products/add', icon: FiPlusSquare },
  { label: 'Orders', path: '/admin/orders', icon: FiPackage },
];

export default function AdminLayout({ children, title }) {
  const { admin, adminLogout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-display font-black text-sm">C</span>
          </div>
          <div>
            <span className="font-display font-black text-base text-white block leading-tight">Clothify</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
              isActive(path)
                ? 'bg-accent text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Icon size={16} />
            {label}
            {isActive(path) && <FiChevronRight size={13} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {admin?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.name}</p>
            <p className="text-gray-400 text-[10px] truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors rounded-sm"
        >
          <FiLogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-gray-900 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-gray-900 flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-600 hover:text-primary"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="font-display font-bold text-base text-primary">{title}</h1>
          </div>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-primary transition-colors font-medium"
          >
            View Store →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
