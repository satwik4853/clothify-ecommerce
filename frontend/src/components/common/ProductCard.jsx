import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

// Placeholder gradient for missing images
const PLACEHOLDER = 'https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=No+Image';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount =
    product.discountPrice > 0
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;
  const image = product.images?.[0] || PLACEHOLDER;
  const hoverImage = product.images?.[1] || image;

  // Quick add to cart with first available size
  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const firstSize = product.sizes?.find((s) => s.stock > 0);
    if (!firstSize) {
      toast.error('Out of stock');
      return;
    }
    setAdding(true);
    await addToCart(product._id, firstSize.size, '', 1);
    setAdding(false);
  };

  return (
    <Link to={`/products/${product._id}`} className="group block product-card">
      {/* Image container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {/* Main image */}
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          loading="lazy"
        />
        {/* Hover second image */}
        {product.images?.length > 1 && (
          <img
            src={hoverImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            onError={(e) => { e.target.src = PLACEHOLDER; }}
            loading="lazy"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold px-2 py-1 tracking-widest uppercase">
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 right-10 bg-accent text-white text-[10px] font-bold px-2 py-0.5">
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted((v) => !v); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label="Wishlist"
        >
          <FiHeart
            size={14}
            className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </button>

        {/* Quick add overlay */}
        <div className="product-card-overlay absolute bottom-0 left-0 right-0 opacity-0 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={adding}
            className="w-full bg-primary text-white py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            <FiShoppingBag size={14} />
            {adding ? 'ADDING...' : 'QUICK ADD'}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="pt-3 pb-4 px-1">
        {product.subCategory && (
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5 font-medium">
            {product.category} {product.subCategory}
          </p>
        )}
        <h3 className="text-sm font-semibold text-primary line-clamp-2 leading-snug mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Color dots */}
        {product.colors?.length > 1 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 5).map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: c.hex || '#ccc' }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-500 self-center">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
