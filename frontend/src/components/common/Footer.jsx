import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiInstagram, FiFacebook, FiTwitter, FiYoutube,
  FiMapPin, FiMail, FiPhone,
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const footerLinks = {
  'SHOP': [
    { label: 'Men', path: '/men' },
    { label: 'Women', path: '/women' },
    { label: 'Kids', path: '/kids' },
    { label: 'New Arrivals', path: '/products?sort=newest' },
    { label: 'Sale', path: '/products?sort=price-asc' },
  ],
  'HELP': [
    { label: 'FAQ', path: '#' },
    { label: 'Shipping Policy', path: '#' },
    { label: 'Return Policy', path: '#' },
    { label: 'Size Guide', path: '#' },
    { label: 'Track Order', path: '/my-orders' },
  ],
  'COMPANY': [
    { label: 'About Us', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Contact Us', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms & Conditions', path: '#' },
  ],
};

const socials = [
  { icon: FiInstagram, label: 'Instagram', href: '#' },
  { icon: FiFacebook, label: 'Facebook', href: '#' },
  { icon: FiTwitter, label: 'Twitter', href: '#' },
  { icon: FiYoutube, label: 'YouTube', href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    toast.success('🎉 You\'re subscribed! Welcome to Clothify.');
    setEmail('');
  };

  return (
    <footer className="bg-primary text-white mt-16">
      {/* Benefits strip */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Free Shipping', sub: 'On orders above ₹999' },
            { icon: '↩️', title: '30-Day Returns', sub: 'Easy & hassle-free' },
            { icon: '✅', title: '100% Authentic', sub: 'Genuine products only' },
            { icon: '🔒', title: 'Secure Payments', sub: 'Safe & encrypted' },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="font-semibold text-sm">{b.title}</p>
                <p className="text-gray-400 text-xs">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-display font-black text-base">C</span>
              </div>
              <span className="font-display font-black text-2xl tracking-tight">Clothify</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Bold streetwear and casual fashion for Men, Women & Kids. Express yourself with every thread.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mb-8">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-700 hover:bg-accent rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <FiMapPin size={14} className="text-accent flex-shrink-0" />
                <span>123 Fashion Street, Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMail size={14} className="text-accent flex-shrink-0" />
                <span>support@clothify.in</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone size={14} className="text-accent flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display font-bold text-sm tracking-widest mb-5 text-white">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 text-sm hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-700 pt-10">
          <div className="max-w-lg">
            <h4 className="font-display font-bold text-lg mb-2">Stay in the Loop</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive drops, style tips, and early access to sales.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-gray-800 border border-gray-600 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="bg-accent text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Clothify. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Payments accepted:</span>
            {['VISA', 'MC', 'UPI', 'COD'].map((p) => (
              <span key={p} className="border border-gray-600 px-2 py-0.5 rounded text-[10px] font-semibold text-gray-400">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
