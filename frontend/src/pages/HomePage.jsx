import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

/* ─── Hero Slides ───────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'NEW SEASON DROP',
    title: 'Own Every\nLook',
    subtitle: 'Streetwear crafted for the bold — oversized fits, premium fabrics, iconic prints.',
    cta: 'Shop Men',
    ctaPath: '/men',
    bg: 'from-gray-900 via-gray-800 to-gray-900',
    accent: '#e63946',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=80',
    imgBg: '#2d2d2d',
  },
  {
    id: 2,
    tag: 'WOMEN\'S COLLECTION',
    title: 'Style That\nSpeaks',
    subtitle: 'From relaxed basics to statement pieces — curated fashion for every occasion.',
    cta: 'Shop Women',
    ctaPath: '/women',
    bg: 'from-gray-900 via-gray-800 to-gray-900',
    accent: '#f9a8d4',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop&q=80',
    imgBg: '#4a1942',
  },
  {
    id: 3,
    tag: 'KIDS\' FAVOURITES',
    title: 'Fun Fits\nFor Little Ones',
    subtitle: 'Colourful, comfortable and made to move — because kids deserve great style too.',
    cta: 'Shop Kids',
    ctaPath: '/kids',
    bg: 'from-gray-900 via-gray-800 to-gray-900',
    accent: '#7dd3fc',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&h=1000&fit=crop&q=80',
    imgBg: '#0c4a6e',
  },
];

/* ─── Category Cards ─────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    label: 'Men',
    path: '/men',
    text: '#fff',
    sub: 'T-Shirts, Hoodies, Shirts & More',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop&q=80',
  },
  {
    label: 'Women',
    path: '/women',
    text: '#fff',
    sub: 'Tops, Dresses, Joggers & More',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop&q=80',
  },
  {
    label: 'Kids',
    path: '/kids',
    text: '#fff',
    sub: 'T-Shirts, Sets, Shorts & More',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop&q=80',
  },
];

/* ─── Shop-by-Style banner rows ──────────────────────────────────────────── */
const STYLE_BANNERS = [
  {
    label: 'EXPLORE SHIRTS',
    sub: 'Embroidered · Printed · Cotton Linen',
    path: '/men?subCategory=Shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490114538077-0ec7de863df4?w=300&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop&q=80',
    ],
    bg: '#1a1a1a',
  },
  {
    label: 'WOMEN\'S LOOKS',
    sub: 'Dresses · Tops · Jackets',
    path: '/women',
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1485231183474-c79dbbe6e5f8?w=300&h=400&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop&q=80',
    ],
    bg: '#4a1942',
  },
];
const QUICK_CATS = [
  { label: 'Oversized T-Shirts', path: '/men?subCategory=T-Shirts', emoji: '👕' },
  { label: 'Hoodies', path: '/men?subCategory=Hoodies', emoji: '🧥' },
  { label: 'Shirts', path: '/men?subCategory=Shirts', emoji: '👔' },
  { label: 'Joggers', path: '/men?subCategory=Joggers', emoji: '🩳' },
  { label: 'Dresses', path: '/women?subCategory=Dresses', emoji: '👗' },
  { label: 'Tops', path: '/women?subCategory=Tops', emoji: '🎽' },
  { label: 'Kids Sets', path: '/kids?subCategory=Sets', emoji: '🧒' },
  { label: 'Polos', path: '/men?subCategory=Polos', emoji: '🎾' },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   HeroCarousel
═══════════════════════════════════════════════════════════════════════════════ */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const slide = HERO_SLIDES[current];

  return (
    <section className={`relative bg-gradient-to-br ${slide.bg} overflow-hidden transition-all duration-700`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12 min-h-[520px]">

        {/* Text */}
        <div className="flex-1 text-white z-10">
          <span
            className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 px-3 py-1.5 rounded-sm"
            style={{ backgroundColor: slide.accent, color: '#fff' }}
          >
            {slide.tag}
          </span>
          <h1
            className="font-display font-black text-5xl lg:text-7xl leading-[1.05] mb-5 whitespace-pre-line"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
          >
            {slide.title}
          </h1>
          <p className="text-gray-300 text-base lg:text-lg max-w-md mb-8 leading-relaxed">
            {slide.subtitle}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              to={slide.ctaPath}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors"
            >
              {slide.cta} <FiArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border border-white text-white font-bold px-8 py-3.5 text-sm uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Explore All
            </Link>
          </div>
        </div>

        {/* Real product image */}
        <div
          className="flex-1 overflow-hidden min-h-[280px] lg:min-h-[420px] w-full lg:max-w-lg rounded-sm"
          style={{ backgroundColor: slide.imgBg }}
        >
          {slide.image ? (
            <img
              src={slide.image}
              alt={slide.cta}
              className="w-full h-full object-cover object-top"
              style={{ minHeight: '280px' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-30 text-white text-9xl select-none">
              👕
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Next slide"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FeaturesBar
═══════════════════════════════════════════════════════════════════════════════ */
function FeaturesBar() {
  const features = [
    { icon: '💳', text: '10% Cashback on all App Orders' },
    { icon: '📦', text: '30 Days Easy Returns & Exchanges' },
    { icon: '🚚', text: 'Free & Fast Shipping' },
    { icon: '🔒', text: '100% Secure Payments' },
  ];
  return (
    <div className="bg-gray-50 border-y border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200">
        {features.map((f) => (
          <div key={f.text} className="flex items-center justify-center gap-3 px-4 py-2">
            <span className="text-xl flex-shrink-0">{f.icon}</span>
            <span className="text-xs font-medium text-gray-700 leading-tight">{f.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CategorySection
═══════════════════════════════════════════════════════════════════════════════ */
function CategorySection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="font-display font-black text-3xl lg:text-4xl text-primary uppercase tracking-tight">
          Shop By Category
        </h2>
        <div className="w-12 h-1 bg-accent mx-auto mt-3" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.label}
            to={cat.path}
            className="group relative overflow-hidden aspect-[3/4] block"
          >
            {/* Real photo background */}
            <img
              src={cat.image}
              alt={cat.label}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            {/* Hover tint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
              <h3 className="font-display font-black text-4xl tracking-tight mb-1">
                {cat.label}
              </h3>
              <p className="text-sm text-white/70 mb-4">{cat.sub}</p>
              <span className="inline-flex items-center gap-2 border border-white text-white font-bold text-xs px-5 py-2 uppercase tracking-widest group-hover:bg-white group-hover:text-primary transition-all duration-200">
                Shop Now <FiArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   QuickCategoryStrip
═══════════════════════════════════════════════════════════════════════════════ */
function QuickCategoryStrip() {
  return (
    <div className="bg-primary py-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 px-4 lg:px-8 max-w-[1400px] mx-auto min-w-max lg:min-w-0 lg:justify-center lg:flex-wrap">
        {QUICK_CATS.map((c) => (
          <Link
            key={c.label}
            to={c.path}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 whitespace-nowrap transition-colors duration-150 rounded-sm"
          >
            <span>{c.emoji}</span>
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   StyleBannerSection  – "Explore Shirts / Women's Looks" wide banners with real photos
═══════════════════════════════════════════════════════════════════════════════ */
function StyleBannerSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-5">
      {STYLE_BANNERS.map((banner) => (
        <Link
          key={banner.label}
          to={banner.path}
          className="group relative flex overflow-hidden min-h-[220px] lg:min-h-[280px]"
          style={{ backgroundColor: banner.bg }}
        >
          {/* Left text panel */}
          <div className="flex-shrink-0 flex flex-col justify-center px-8 lg:px-14 py-8 z-10 min-w-[200px]">
            <p className="text-white/60 text-xs font-bold uppercase tracking-[0.25em] mb-2">
              {banner.sub}
            </p>
            <h3 className="text-white font-display font-black text-2xl lg:text-4xl uppercase leading-tight mb-5">
              {banner.label}
            </h3>
            <span className="inline-flex items-center gap-2 border border-white text-white text-xs font-bold px-5 py-2.5 uppercase tracking-widest w-fit group-hover:bg-white group-hover:text-primary transition-all duration-200">
              Shop Now <FiArrowRight size={12} />
            </span>
          </div>

          {/* Right photos strip */}
          <div className="flex-1 flex overflow-hidden">
            {banner.images.map((src, i) => (
              <div
                key={i}
                className="flex-1 overflow-hidden border-l border-white/10"
              >
                <img
                  src={src}
                  alt={banner.label}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>

          {/* Subtle right-side gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r pointer-events-none"
            style={{ backgroundImage: `linear-gradient(to right, ${banner.bg}, transparent)` }}
          />
        </Link>
      ))}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TrendingSection
═══════════════════════════════════════════════════════════════════════════════ */
function TrendingSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Men', 'Women', 'Kids'];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { limit: 8, sort: 'popular' };
        if (activeTab !== 'All') params.category = activeTab;
        const { data } = await productAPI.getAll(params);
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeTab]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-black text-3xl lg:text-4xl text-primary uppercase tracking-tight">
            Trending Now
          </h2>
          <div className="w-12 h-1 bg-accent mt-2" />
        </div>
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-sm self-start sm:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 rounded-sm
                ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No products yet.</p>
          <p className="text-sm mt-1">Add some products from the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          to={activeTab === 'All' ? '/products' : `/${activeTab.toLowerCase()}`}
          className="btn-secondary inline-flex items-center gap-2"
        >
          View All {activeTab !== 'All' ? activeTab : ''} Products <FiArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   NewArrivalsSection
═══════════════════════════════════════════════════════════════════════════════ */
function NewArrivalsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productAPI.getAll({ limit: 4, sort: 'newest' });
        setProducts(data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-3xl lg:text-4xl text-primary uppercase tracking-tight">
              New Arrivals
            </h2>
            <div className="w-12 h-1 bg-accent mt-2" />
          </div>
          <Link to="/products?sort=newest" className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        {loading ? <Loader /> : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PromoBanner
═══════════════════════════════════════════════════════════════════════════════ */
function PromoBanner() {
  return (
    <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
      <div className="bg-primary text-white rounded-sm overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between px-8 lg:px-16 py-10 gap-6">
          <div>
            <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-2">Limited Time Offer</p>
            <h3 className="font-display font-black text-3xl lg:text-5xl uppercase leading-tight mb-2">
              Up to 50% Off
            </h3>
            <p className="text-gray-400 text-sm">Use code <span className="text-white font-bold">CLOTHIFY50</span> at checkout</p>
          </div>
          <Link to="/products" className="flex-shrink-0 bg-accent text-white font-bold px-10 py-4 text-sm uppercase tracking-widest hover:bg-red-700 transition-colors inline-flex items-center gap-2">
            Shop the Sale <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   HomePage (assembled)
═══════════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <FeaturesBar />
      <QuickCategoryStrip />
      <CategorySection />
      <StyleBannerSection />
      <TrendingSection />
      <PromoBanner />
      <NewArrivalsSection />
    </div>
  );
}
