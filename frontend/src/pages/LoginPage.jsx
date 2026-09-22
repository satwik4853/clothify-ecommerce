import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuth, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isAuth) navigate(redirect, { replace: true }); }, [isAuth, navigate, redirect]);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-display font-black text-base">C</span>
            </div>
            <span className="font-display font-black text-2xl text-primary">Clothify</span>
          </Link>
          <h1 className="font-display font-black text-2xl text-primary mt-5 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm">Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                placeholder="you@example.com"
                className={`input-field pl-10 ${errors.email ? 'border-accent' : ''}`}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-accent text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                placeholder="Min. 6 characters"
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-accent' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                aria-label="Toggle password"
              >
                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-accent text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-accent transition-colors">
              Create one
            </Link>
          </p>

          <div className="border-t border-gray-100 pt-4 text-center">
            <Link to="/admin/login" className="text-xs text-gray-400 hover:text-primary transition-colors">
              Admin Login →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
