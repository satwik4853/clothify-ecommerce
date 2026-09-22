import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiHeart, FiShoppingBag, FiZap, FiShare2, FiStar,
  FiChevronDown, FiChevronUp, FiTruck, FiRefreshCw, FiShield,
  FiMinus, FiPlus,
} from 'react-icons/fi';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import Breadcrumb from '../components/common/Breadcrumb';
import { toast } from 'react-toastify';

const PLACEHOLDER = 'https://via.placeholder.com/600x750/f3f4f6/9ca3af?text=No+Image';

/* ─── Star rating display ─────────────────────────────────────────────────── */
function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={13}
            className={star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count} reviews)</span>
    </div>
  );
}

/* ─── Accordion ───────────────────────────────────────────────────────────── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-4 text-sm font-semibold text-primary"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
      </button>
      {open && <div className="pb-4 text-sm text-gray-600 leading-relaxed">{children}</div>}
    </div>
  );
}

/* ─── ImageGallery ────────────────────────────────────────────────────────── */
function ImageGallery({ images, productName }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const allImages = images?.length ? images : [PLACEHOLDER];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex gap-4">
      {/* Thumbnails column */}
      <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
        {allImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`aspect-square overflow-hidden border-2 transition-all ${
              selected === i ? 'border-primary' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img
              src={img || PLACEHOLDER}
              alt={`${productName} ${i + 1}`}
              className="w-full h-full object-cover object-top"
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-zoom-in"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={allImages[selected] || PLACEHOLDER}
            alt={productName}
            className="w-full h-full object-cover object-top transition-transform duration-300"
            style={zoomed ? {
              transform: 'scale(2)',
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            } : {}}
            onError={(e) => { e.target.src = PLACEHOLDER; }}
          />
        </div>

        {/* Prev/Next on mobile */}
        {allImages.length > 1 && (
          <div className="sm:hidden flex justify-center gap-2 mt-3">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === selected ? 'bg-primary w-5' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ProductDetailPage
═══════════════════════════════════════════════════════════════════════════ */
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuth } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getById(id);
      setProduct(data.product);
      // Pre-select first available color
      if (data.product.colors?.length) {
        setSelectedColor(data.product.colors[0].name);
      }
    } catch {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchRelated = useCallback(async () => {
    setRelatedLoading(true);
    try {
      const { data } = await productAPI.getRelated(id);
      setRelated(data.products || []);
    } catch {
      setRelated([]);
    } finally {
      setRelatedLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
    fetchRelated();
    setSelectedSize('');
    setQuantity(1);
  }, [id, fetchProduct, fetchRelated]);

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const stockForSize = selectedSize
    ? product.sizes?.find((s) => s.size === selectedSize)?.stock || 0
    : null;

  const totalStock = product.sizes?.reduce((a, s) => a + s.stock, 0) || 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setSizeError(true);
      toast.error('Please select a size');
      return;
    }
    setSizeError(false);
    setAddingToCart(true);
    await addToCart(product._id, selectedSize, selectedColor, quantity);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      setSizeError(true);
      toast.error('Please select a size');
      return;
    }
    setSizeError(false);
    if (!isAuth) { navigate('/login'); return; }
    setAddingToCart(true);
    const result = await addToCart(product._id, selectedSize, selectedColor, quantity);
    setAddingToCart(false);
    if (result?.success) navigate('/checkout');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuth) { toast.error('Please login to write a review'); return; }
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const crumbs = [
    { label: 'Home', path: '/' },
    { label: product.category, path: `/${product.category.toLowerCase()}` },
    { label: product.subCategory, path: `/${product.category.toLowerCase()}?subCategory=${encodeURIComponent(product.subCategory)}` },
    { label: product.name, path: `/products/${product._id}` },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb crumbs={crumbs} />

      {/* ── Main product section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Left – Image gallery */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right – Product info */}
        <div className="lg:pt-2">
          {/* Badge + fit */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.badge && (
              <span className="bg-primary text-white text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest">
                {product.badge}
              </span>
            )}
            {product.fit && (
              <span className="border border-gray-300 text-gray-600 text-[9px] font-bold px-2.5 py-1 uppercase tracking-widest">
                {product.fit}
              </span>
            )}
          </div>

          {/* Category label */}
          <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
            {product.category} {product.subCategory}
          </p>

          {/* Name */}
          <h1 className="font-display font-black text-2xl lg:text-3xl text-primary leading-tight mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="mb-3">
              <StarRating rating={product.rating} count={product.numReviews} />
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display font-black text-3xl text-primary">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through font-normal">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-accent font-bold text-sm">({discount}% OFF)</span>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-5">Inclusive of all taxes. Free shipping on orders above ₹999.</p>

          {/* Fabric info */}
          {product.fabric && (
            <p className="text-xs text-gray-600 mb-4 font-medium uppercase tracking-wider">
              Fabric: <span className="font-normal normal-case tracking-normal">{product.fabric}</span>
            </p>
          )}

          {/* Color selector */}
          {product.colors?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Colour: <span className="font-normal normal-case tracking-normal">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c.name
                        ? 'border-primary ring-2 ring-primary ring-offset-1 scale-110'
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: c.hex || '#ccc' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-bold uppercase tracking-widest ${sizeError ? 'text-accent' : 'text-primary'}`}>
                Select Size {sizeError && <span className="text-accent font-normal normal-case">(required)</span>}
              </p>
              <button className="text-xs text-gray-500 underline hover:text-primary">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((sizeObj) => {
                const outOfStock = sizeObj.stock === 0;
                return (
                  <button
                    key={sizeObj.size}
                    onClick={() => { if (!outOfStock) { setSelectedSize(sizeObj.size); setSizeError(false); } }}
                    disabled={outOfStock}
                    className={`size-btn ${selectedSize === sizeObj.size ? 'selected' : ''} ${outOfStock ? 'out-of-stock' : ''}`}
                  >
                    {sizeObj.size}
                  </button>
                );
              })}
            </div>

            {/* Stock warning */}
            {selectedSize && stockForSize !== null && stockForSize <= 5 && stockForSize > 0 && (
              <p className="text-accent text-xs font-semibold mt-2">
                Only {stockForSize} left in {selectedSize}!
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Quantity</p>
            <div className="flex items-center border border-gray-300 w-fit">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FiMinus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
          </div>

          {/* CTA buttons */}
          {totalStock === 0 ? (
            <div className="py-4 text-center border border-gray-300 text-gray-500 font-semibold text-sm uppercase tracking-widest mb-4">
              Out of Stock
            </div>
          ) : (
            <div className="flex gap-3 mb-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 btn-secondary flex items-center justify-center gap-2 py-4 text-sm disabled:opacity-60"
              >
                <FiShoppingBag size={16} />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-sm disabled:opacity-60"
              >
                <FiZap size={16} />
                Buy Now
              </button>
            </div>
          )}

          {/* Wishlist + Share row */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setWishlisted((v) => !v)}
              className={`flex items-center gap-2 text-sm font-medium border px-4 py-2.5 transition-colors ${
                wishlisted ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-300 text-gray-700 hover:border-primary'
              }`}
            >
              <FiHeart size={15} className={wishlisted ? 'fill-red-500' : ''} />
              {wishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied!');
              }}
              className="flex items-center gap-2 text-sm font-medium border border-gray-300 text-gray-700 px-4 py-2.5 hover:border-primary transition-colors"
            >
              <FiShare2 size={15} />
              Share
            </button>
          </div>

          {/* Delivery info strip */}
          <div className="bg-gray-50 border border-gray-200 p-4 grid grid-cols-3 gap-3 mb-6 text-center">
            {[
              { icon: FiTruck, label: 'Free Delivery', sub: 'Above ₹999' },
              { icon: FiRefreshCw, label: 'Easy Returns', sub: '30-day policy' },
              { icon: FiShield, label: '100% Genuine', sub: 'Verified product' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label}>
                <Icon size={18} className="mx-auto text-primary mb-1" />
                <p className="text-xs font-semibold text-primary">{label}</p>
                <p className="text-[10px] text-gray-500">{sub}</p>
              </div>
            ))}
          </div>

          {/* Accordion details */}
          <div className="border-t border-gray-200">
            <Accordion title="Product Description" defaultOpen={true}>
              <p className="whitespace-pre-line">{product.description}</p>
            </Accordion>
            {product.fabric && (
              <Accordion title="Fabric & Care">
                <ul className="space-y-1 list-disc list-inside">
                  <li>Fabric: {product.fabric}</li>
                  <li>Machine wash cold with similar colours</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low heat</li>
                  <li>Cool iron if needed</li>
                </ul>
              </Accordion>
            )}
            <Accordion title="Shipping & Returns">
              <ul className="space-y-1 list-disc list-inside">
                <li>Free shipping on orders above ₹999</li>
                <li>Standard delivery: 5–7 business days</li>
                <li>Express delivery available at checkout</li>
                <li>30-day hassle-free returns & exchanges</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

      {/* ── Reviews section ── */}
      <div className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="font-display font-black text-2xl text-primary uppercase mb-6">
          Customer Reviews
          {product.numReviews > 0 && (
            <span className="text-base font-normal text-gray-500 ml-2">({product.numReviews})</span>
          )}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Rating summary */}
          {product.numReviews > 0 && (
            <div className="bg-gray-50 p-6 text-center">
              <div className="text-6xl font-black text-primary mb-1">
                {product.rating?.toFixed(1)}
              </div>
              <StarRating rating={product.rating} count={product.numReviews} />
              <p className="text-xs text-gray-500 mt-2">{product.numReviews} verified reviews</p>
            </div>
          )}

          {/* Review list */}
          <div className="lg:col-span-2 space-y-5">
            {product.reviews?.length === 0 && (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
            )}
            {product.reviews?.map((review) => (
              <div key={review._id} className="border-b border-gray-100 pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {review.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{review.name}</p>
                    <StarRating rating={review.rating} count={null} />
                  </div>
                  <span className="ml-auto text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Write review form */}
        {isAuth && (
          <div className="mt-8 bg-gray-50 p-6">
            <h3 className="font-display font-bold text-base uppercase tracking-wider mb-4">Write a Review</h3>
            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <FiStar
                        size={22}
                        className={star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={4}
                  placeholder="Share your experience with this product..."
                  className="input-field resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary disabled:opacity-60"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Related products ── */}
      {!relatedLoading && related.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-black text-2xl text-primary uppercase">You May Also Like</h2>
            <Link
              to={`/${product.category.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-wider text-primary hover:text-accent transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
