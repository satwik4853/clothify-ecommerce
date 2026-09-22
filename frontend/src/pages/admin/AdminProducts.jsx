import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiEyeOff, FiEye } from 'react-icons/fi';
import { productAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const PLACEHOLDER = 'https://via.placeholder.com/56x70/f3f4f6/9ca3af?text=?';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await productAPI.getAdminAll(params);
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"? It won't appear in the store.`)) return;
    setDeleting(id);
    try {
      await productAPI.delete(id);
      toast.success('Product deactivated');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const formData = new FormData();
      formData.append('isActive', !product.isActive);
      await productAPI.update(product._id, formData);
      toast.success(`Product ${!product.isActive ? 'activated' : 'deactivated'}`);
      fetchProducts();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <AdminLayout title="Products">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-300 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-primary bg-white"
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
        <Link to="/admin/products/add" className="btn-primary flex items-center gap-2 whitespace-nowrap px-5 py-2.5 text-sm">
          <FiPlus size={15} /> Add Product
        </Link>
      </div>

      <p className="text-xs text-gray-500 mb-3">{total} products</p>

      {loading ? <Loader /> : (
        <div className="bg-white border border-gray-200">
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm mb-4">No products found.</p>
              <Link to="/admin/products/add" className="btn-primary inline-flex items-center gap-2">
                <FiPlus size={14} /> Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => {
                    const totalStock = p.sizes?.reduce((a, s) => a + s.stock, 0) || 0;
                    const displayPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
                    return (
                      <tr key={p._id} className={`hover:bg-gray-50 transition-colors ${!p.isActive ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || PLACEHOLDER}
                              alt={p.name}
                              className="w-10 h-12 object-cover object-top bg-gray-100 flex-shrink-0"
                              onError={(e) => { e.target.src = PLACEHOLDER; }}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-primary line-clamp-1">{p.name}</p>
                              {p.badge && <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 font-bold uppercase">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>{p.category}</div>
                          <div className="text-xs text-gray-400">{p.subCategory}</div>
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          ₹{displayPrice?.toLocaleString('en-IN')}
                          {p.discountPrice > 0 && (
                            <div className="text-xs text-gray-400 line-through">₹{p.price?.toLocaleString('en-IN')}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${totalStock === 0 ? 'text-red-500' : totalStock <= 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {totalStock}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/admin/products/edit/${p._id}`}
                              className="p-1.5 text-gray-500 hover:text-primary hover:bg-gray-100 transition-colors rounded"
                              title="Edit"
                            >
                              <FiEdit2 size={14} />
                            </Link>
                            <button
                              onClick={() => handleToggleActive(p)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded"
                              title={p.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {p.isActive ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                            </button>
                            <button
                              onClick={() => handleDelete(p._id, p.name)}
                              disabled={deleting === p._id}
                              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors rounded disabled:opacity-40"
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 border text-sm disabled:opacity-40 hover:border-primary">← Prev</button>
          <span className="px-4 py-2 bg-primary text-white text-sm">{page} / {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
            className="px-4 py-2 border text-sm disabled:opacity-40 hover:border-primary">Next →</button>
        </div>
      )}
    </AdminLayout>
  );
}
