import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const MEN_CATEGORIES = ['T-Shirts', 'Shirts', 'Hoodies', 'Polos', 'Joggers', 'Shorts', 'Jackets'];
const WOMEN_CATEGORIES = ['T-Shirts', 'Tops', 'Dresses', 'Hoodies', 'Joggers', 'Skirts', 'Jackets'];
const KIDS_CATEGORIES = ['T-Shirts', 'Sets', 'Shorts', 'Hoodies'];

export default function Navbar() {
  const { user, logout, isAuth } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'men'|'women'|'kids'|null
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const userRef = useRef(null);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setActiveDropdown(null);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'MEN', path: '/men', dropdown: MEN_CATEGORIES, key: 'men' },
    { label: 'WOMEN', path: '/women', dropdown: WOMEN_CATEGORIES, key: 'women' },
    { label: 'KIDS', path: '/kids', dropdown: KIDS_CATEGORIES, key: 'kids' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}>
      {/* Top strip */}
      <div className="bg-primary text-white text-xs text-center py-2 tracking-widest font-medium">
        FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; 30 DAYS EASY RETURNS &nbsp;|&nbsp; 100% AUTHENTIC PRODUCTS
      </div>

      {/* Main navbar */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden text-primary p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-display font-black text-sm leading-none">C</span>
            </div>
            <span className="font-display font-black text-xl tracking-tight text-primary hidden sm:block">
              Clothify
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8 ml-8 flex-1" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div
                key={link.key}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-1 text-sm font-bold tracking-wider py-5 border-b-2 transition-colors duration-150
                    ${isActive(link.path) ? 'border-primary text-primary' : 'border-transparent text-gray-700 hover:text-primary hover:border-primary'}`}
                >
                  {link.label}
                  <FiChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === link.key ? 'rotate-180' : ''}`} />
                </Link>

                {/* Mega dropdown */}
                {activeDropdown === link.key && (
                  <div className="absolute top-full left-0 bg-white border border-gray-100 shadow-xl min-w-[200px] py-4 animate-fade-in z-50">
                    <Link
                      to={link.path}
                      className="block px-5 py-2 text-xs font-bold text-primary tracking-widest uppercase border-b border-gray-100 mb-2"
                    >
                      All {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                    </Link>
                    {link.dropdown.map((cat) => (
                      <Link
                        key={cat}
                        to={`${link.path}?subCategory=${encodeURIComponent(cat)}`}
                        className="block px-5 py-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 text-gray-700 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* User */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  if (!isAuth) navigate('/login');
                  else setUserMenuOpen((v) => !v);
                }}
                className="p-2 text-gray-700 hover:text-primary transition-colors"
                aria-label="Account"
              >
                <FiUser size={20} />
              </button>
              {userMenuOpen && isAuth && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 shadow-xl w-52 py-2 animate-fade-in z-50">
                  <p className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 font-medium truncate">
                    {user?.name}
                  </p>
                  <Link to="/my-orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-gray-50">
                    My Orders
                  </Link>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button className="p-2 text-gray-700 hover:text-primary transition-colors hidden sm:block" aria-label="Wishlist">
              <FiHeart size={20} />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-primary transition-colors" aria-label="Cart">
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Expandable search bar */}
        {searchOpen && (
          <div className="pb-3 animate-fade-in">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more..."
                className="flex-1 border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="btn-primary px-6 py-2.5">
                <FiSearch size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg animate-slide-in">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.key}>
                <button
                  onClick={() => setActiveDropdown(activeDropdown === link.key ? null : link.key)}
                  className="w-full flex items-center justify-between py-3 text-sm font-bold tracking-wider text-gray-800 border-b border-gray-100"
                >
                  {link.label}
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeDropdown === link.key ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeDropdown === link.key && (
                  <div className="pl-4 py-2 space-y-1">
                    <Link to={link.path} className="block py-2 text-sm text-primary font-semibold">
                      All {link.label.charAt(0) + link.label.slice(1).toLowerCase()}
                    </Link>
                    {link.dropdown.map((cat) => (
                      <Link
                        key={cat}
                        to={`${link.path}?subCategory=${encodeURIComponent(cat)}`}
                        className="block py-2 text-sm text-gray-600 hover:text-primary"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {isAuth ? (
                <>
                  <p className="text-xs text-gray-500 py-2">Hello, {user?.name}</p>
                  <Link to="/my-orders" className="block py-2 text-sm text-gray-700">My Orders</Link>
                  <button onClick={logout} className="block py-2 text-sm text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-sm font-semibold text-primary">Login</Link>
                  <Link to="/register" className="block py-2 text-sm text-gray-700">Create Account</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
