import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FiFilter, FiX, FiChevronDown, FiChevronUp, FiGrid, FiList, FiSearch,
} from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import Breadcrumb from '../components/common/Breadcrumb';

/* ─── constants ─────────────────────────────────────────────────────────────── */
const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const SUB_CATEGORIES = {
  Men: ['T-Shirts', 'Shirts', 'Hoodies', 'Polos', 'Joggers', 'Shorts', 'Jackets', 'Oversized T-Shirts'],
  Women: ['T-Shirts', 'Tops', 'Dresses', 'Hoodies', 'Joggers', 'Skirts', 'Jackets', 'Crop Tops'],
  Kids: ['T-Shirts', 'Sets', 'Shorts', 'Hoodies', 'Joggers'],
  All: ['T-Shirts', 'Shirts', 'Hoodies', 'Polos', 'Joggers', 'Shorts', 'Jackets', 'Dresses', 'Tops'],
};

const COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#f5f5f5' },
  { name: 'Red', hex: '#e63946' },
  { name: 'Blue', hex: '#457b9d' },
  { name: 'Green', hex: '#2a9d8f' },
  { name: 'Yellow', hex: '#e9c46a' },
  { name: 'Brown', hex: '#8d6748' },
  { name: 'Grey', hex: '#9ca3af' },
  { name: 'Beige', hex: '#d4b896' },
  { name: 'Navy', hex: '#1d3557' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Pink', hex: '#f4a5c8' },
];

const PRICE_RANGES = [
  { label: 'Under ₹499', min: 0, max: 499 },
  { label: '₹500 – ₹999', min: 500, max: 999 },
  { label: '₹1000 – ₹1499', min: 1000, max: 1499 },
  { label: '₹1500 – ₹1999', min: 1500, max: 1999 },
  { label: 'Above ₹2000', min: 2000, max: 99999 },
];

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Top Rated', value: 'rating' },
];

/* ─── helpers ─────────────────────────────────────────────────────────────── */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/* ─── FilterAccordion ─────────────────────────────────────────────────────── */
function FilterAccordion({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary mb-0"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

/* ─── FiltersSidebar ──────────────────────────────────────────────────────── */
function FiltersSidebar({ filters, setFilters, category, total, onClear }) {
  const subCats = SUB_CATEGORIES[category] || SUB_CATEGORIES.All;

  const toggle = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const setPrice = (range) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange?.label === range.label ? null : range,
    }));
  };

  const activeCount =
    (filters.sizes?.length || 0) +
    (filters.colors?.length || 0) +
    (filters.subCategories?.length || 0) +
    (filters.priceRange ? 1 : 0);

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-3 border-b border-gray-200">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Filters</span>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-accent font-semibold hover:underline"
          >
            Clear All ({activeCount})
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">{total} items</p>

      {/* Category sub-filter */}
      <FilterAccordion title="Category">
        <div className="space-y-1">
          {subCats.map((cat) => (
            <label key={cat} className="filter-checkbox">
              <input
                type="checkbox"
                checked={(filters.subCategories || []).includes(cat)}
                onChange={() => toggle('subCategories', cat)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      {/* Size */}
      <FilterAccordion title="Size">
        {/* Size search */}
        <div className="relative mb-3">
          <FiSearch size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for Size"
            className="w-full border border-gray-200 pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle('sizes', s)}
              className={`size-btn text-xs ${(filters.sizes || []).includes(s) ? 'selected' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterAccordion>

      {/* Color */}
      <FilterAccordion title="Colour">
        <div className="space-y-1">
          {COLORS.map((c) => (
            <label key={c.name} className="filter-checkbox">
              <input
                type="checkbox"
                checked={(filters.colors || []).includes(c.name)}
                onChange={() => toggle('colors', c.name)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0 inline-block"
                style={{ backgroundColor: c.hex }}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>

      {/* Price */}
      <FilterAccordion title="Price">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="filter-checkbox">
              <input
                type="radio"
                name="price"
                checked={filters.priceRange?.label === range.label}
                onChange={() => setPrice(range)}
                className="accent-primary w-3.5 h-3.5"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </FilterAccordion>
    </aside>
  );
}

/* ─── ActiveFilterTags ────────────────────────────────────────────────────── */
function ActiveFilterTags({ filters, setFilters }) {
  const tags = [];
  (filters.subCategories || []).forEach((v) => tags.push({ key: 'subCategories', value: v, label: v }));
  (filters.sizes || []).forEach((v) => tags.push({ key: 'sizes', value: v, label: `Size: ${v}` }));
  (filters.colors || []).forEach((v) => tags.push({ key: 'colors', value: v, label: v }));
  if (filters.priceRange) tags.push({ key: 'priceRange', value: null, label: filters.priceRange.label });

  if (tags.length === 0) return null;

  const remove = (tag) => {
    setFilters((prev) => {
      if (tag.key === 'priceRange') return { ...prev, priceRange: null };
      return { ...prev, [tag.key]: (prev[tag.key] || []).filter((v) => v !== tag.value) };
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <span
          key={`${tag.key}-${tag.value}`}
          className="inline-flex items-center gap-1.5 bg-gray-100 text-xs font-medium text-gray-700 px-3 py-1.5 rounded-sm"
        >
          {tag.label}
          <button onClick={() => remove(tag)} className="hover:text-red-500">
            <FiX size={11} />
          </button>
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ProductListPage
═══════════════════════════════════════════════════════════════════════════ */
export default function ProductListPage({ category }) {
  const query = useQuery();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParam = query.get('search') || '';
  const subCategoryParam = query.get('subCategory') || '';
  const sortParam = query.get('sort') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState(sortParam);
  const [gridCols, setGridCols] = useState(4); // 3 or 4
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    subCategories: subCategoryParam ? [subCategoryParam] : [],
    sizes: [],
    colors: [],
    priceRange: null,
  });

  // Sync URL param changes into filter state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      subCategories: subCategoryParam ? [subCategoryParam] : prev.subCategories,
    }));
    setSort(sortParam);
    setPage(1);
  }, [location.search]);

  // Fetch products whenever filters / sort / page / category changes
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (searchParam) params.search = searchParam;
      if (sort) params.sort = sort;
      if (filters.subCategories?.length) params.subCategory = filters.subCategories.join(',');
      if (filters.sizes?.length) params.size = filters.sizes.join(',');
      if (filters.colors?.length) params.color = filters.colors.join(',');
      if (filters.priceRange) {
        params.minPrice = filters.priceRange.min;
        params.maxPrice = filters.priceRange.max;
      }
      const { data } = await productAPI.getAll(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, searchParam, sort, filters, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setFilters({ subCategories: [], sizes: [], colors: [], priceRange: null });
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  // Breadcrumb
  const crumbs = [{ label: 'Home', path: '/' }];
  if (category) crumbs.push({ label: category, path: `/${category.toLowerCase()}` });
  if (searchParam) crumbs.push({ label: `"${searchParam}"`, path: location.pathname + location.search });
  else if (!category) crumbs.push({ label: 'All Products', path: '/products' });

  const pageTitle = searchParam
    ? `Search: "${searchParam}"`
    : category
    ? `${category}'s Collection`
    : 'All Products';

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb crumbs={crumbs} />

      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl lg:text-3xl text-primary uppercase">
            {pageTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{total} items</p>
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* ── Desktop Filters Sidebar ── */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <FiltersSidebar
            filters={filters}
            setFilters={setFilters}
            category={category || 'All'}
            total={total}
            onClear={clearFilters}
          />
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold text-primary border border-gray-300 px-4 py-2"
            >
              <FiFilter size={14} /> Filter
            </button>

            <ActiveFilterTags filters={filters} setFilters={setFilters} />

            <div className="flex items-center gap-3 ml-auto flex-shrink-0">
              {/* Grid toggle */}
              <div className="hidden sm:flex gap-1">
                {[3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setGridCols(n)}
                    className={`p-1.5 rounded transition-colors ${gridCols === n ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                    aria-label={`${n} columns`}
                  >
                    {n === 4 ? <FiGrid size={16} /> : <FiList size={16} />}
                  </button>
                ))}
              </div>
              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="border border-gray-300 text-sm px-3 py-2 pr-8 focus:outline-none focus:border-primary appearance-none bg-white cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-xl text-primary mb-2">No products found</h3>
              <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search term.</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-2 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 lg:gap-5`}>
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 2)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && arr[i - 1] !== p - 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 text-sm font-medium border transition-colors ${
                            page === p
                              ? 'bg-primary text-white border-primary'
                              : 'border-gray-300 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Mobile Filters Drawer ── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="font-display font-bold text-base">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close">
                <FiX size={20} />
              </button>
            </div>
            <div className="px-5 py-2">
              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
                category={category || 'All'}
                total={total}
                onClear={clearFilters}
              />
            </div>
            <div className="sticky bottom-0 px-5 py-4 bg-white border-t border-gray-200">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="btn-primary w-full"
              >
                View {total} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
