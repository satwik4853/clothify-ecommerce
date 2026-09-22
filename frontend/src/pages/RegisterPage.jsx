import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, isAuth, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isAuth) navigate('/', { replace: true }); }, [isAuth, navigate]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await register(form.name.trim(), form.email, form.password);
  };

  // Password strength
  const strength = [
    form.password.length >= 6,
    /[A-Z]/.test(form.password),
    /[0-9]/.test(form.password),
    /[^a-zA-Z0-9]/.test(form.password),
  ].filter(Boolean).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][strength];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-display font-black text-base">C</span>
            </div>
            <span className="font-display font-black text-2xl text-primary">Clothify</span>
          </Link>
          <h1 className="font-display font-black text-2xl text-primary mt-5 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm">Join Clothify and start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-8 space-y-5" noValidate>
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={`input-field pl-10 ${errors.name ? 'border-accent' : ''}`}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="text-accent text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Email Address</label>
            <div className="relative">
              <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`input-field pl-10 ${errors.email ? 'border-accent' : ''}`}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-accent text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Password</label>
            <div className="relative">
              <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-accent' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-accent text-xs mt-1">{errors.password}</p>}
            {/* Strength bar */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500">Strength: <span className="font-semibold">{strengthLabel}</span></p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Confirm Password</label>
            <div className="relative">
              <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className={`input-field pl-10 pr-10 ${errors.confirmPassword ? 'border-accent' : form.confirmPassword && form.password === form.confirmPassword ? 'border-green-400' : ''}`}
              />
              {form.confirmPassword && form.password === form.confirmPassword && (
                <FiCheck size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </div>
            {errors.confirmPassword && <p className="text-accent text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-accent transition-colors">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
