import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { adminLogin, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isAdmin) navigate('/admin', { replace: true }); }, [isAdmin, navigate]);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Required';
    if (!password) e.password = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await adminLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield size={24} className="text-white" />
          </div>
          <Link to="/" className="font-display font-black text-2xl text-white block mb-1">Clothify</Link>
          <p className="text-gray-400 text-sm">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 space-y-4" noValidate>
          <h2 className="font-display font-bold text-lg text-primary uppercase tracking-wider mb-1">Admin Login</h2>
          <p className="text-xs text-gray-500 mb-4">Restricted access. Authorized personnel only.</p>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Email</label>
            <div className="relative">
              <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                className={`input-field pl-9 ${errors.email ? 'border-accent' : ''}`}
                placeholder="admin@clothify.in"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-accent text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Password</label>
            <div className="relative">
              <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                className={`input-field pl-9 pr-9 ${errors.password ? 'border-accent' : ''}`}
                placeholder="Admin password"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              </button>
            </div>
            {errors.password && <p className="text-accent text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Login to Admin Panel'}
          </button>

          <p className="text-center text-xs text-gray-400 pt-2">
            <Link to="/login" className="hover:text-primary transition-colors">← Back to Customer Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
