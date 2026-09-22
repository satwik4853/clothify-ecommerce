import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiX, FiUpload } from 'react-icons/fi';
import { productAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import { toast } from 'react-toastify';

const SIZES_LIST = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const CATEGORIES = ['Men', 'Women', 'Kids'];
const SUB_CATEGORIES = {
  Men: ['T-Shirts', 'Shirts', 'Hoodies', 'Polos', 'Joggers', 'Shorts', 'Jackets', 'Oversized T-Shirts'],
  Women: ['T-Shirts', 'Tops', 'Dresses', 'Hoodies', 'Joggers', 'Skirts', 'Jackets', 'Crop Tops'],
  Kids: ['T-Shirts', 'Sets', 'Shorts', 'Hoodies', 'Joggers'],
};
const FITS = ['', 'Oversized Fit', 'Classic Fit', 'Slim Fit', 'Relaxed Fit', 'Boxy Fit', 'Crop Fit'];

const BLANK_COLOR = { name: '', hex: '#000000' };

const defaultForm = {
  name: '', description: '', price: '', discountPrice: '',
  category: 'Men', subCategory: '', fit: '', fabric: '',
  badge: '', isFeatured: false,
};

export default function ProductForm({ initialData = null, productId = null }) {
  const navigate = useNavigate();
  const isEdit = !!productId;
  const title = isEdit ? 'Edit Product' : 'Add Product';

  const [form, setForm] = useState(initialData ? {
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    discountPrice: initialData.discountPrice || '',
    category: initialData.category || 'Men',
    subCategory: initialData.subCategory || '',
    fit: initialData.fit || '',
    fabric: initialData.fabric || '',
    badge: initialData.badge || '',
    isFeatured: initialData.isFeatured || false,
  } : defaultForm);

  const [sizes, setSizes] = useState(
    initialData?.sizes?.length
      ? initialData.sizes
      : SIZES_LIST.map((s) => ({ size: s, stock: 0 }))
  );

  const [colors, setColors] = useState(
    initialData?.colors?.length ? initialData.colors : [{ name: 'Black', hex: '#000000' }]
  );

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSizeStock = (size, stock) => {
    setSizes((prev) => prev.map((s) => s.size === size ? { ...s, stock: Number(stock) } : s));
  };

  const addColor = () => setColors((prev) => [...prev, { ...BLANK_COLOR }]);
  const removeColor = (i) => setColors((prev) => prev.filter((_, idx) => idx !== i));
  const updateColor = (i, field, val) => setColors((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => f.size <= 5 * 1024 * 1024);
    if (valid.length !== files.length) toast.error('Some files exceed 5MB limit');
    setImageFiles((prev) => [...prev, ...valid]);
    const newPreviews = valid.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (i) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = (i) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (!form.subCategory) e.subCategory = 'Sub-category required';
    if (existingImages.length === 0 && imageFiles.length === 0) e.images = 'At least one image required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors below'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('sizes', JSON.stringify(sizes));
      fd.append('colors', JSON.stringify(colors));
      // Keep existing images as JSON string so backend can merge
      fd.append('images', JSON.stringify(existingImages));
      imageFiles.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await productAPI.update(productId, fd);
        toast.success('Product updated!');
      } else {
        await productAPI.create(fd);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, name, type = 'text', required, as, children, placeholder = '' }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-primary mb-1">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={4}
          placeholder={placeholder}
          className={`input-field resize-none ${errors[name] ? 'border-accent' : ''}`}
        />
      ) : as === 'select' ? (
        <select name={name} value={form[name]} onChange={handleChange}
          className={`input-field ${errors[name] ? 'border-accent' : ''}`}>
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input-field ${errors[name] ? 'border-accent' : ''}`}
        />
      )}
      {errors[name] && <p className="text-accent text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <AdminLayout title={title}>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8" encType="multipart/form-data">

        {/* Basic info */}
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Product Name" name="name" required placeholder="e.g. Classic Crew Neck T-Shirt" />
            </div>
            <div className="sm:col-span-2">
              <Field label="Description" name="description" required as="textarea" placeholder="Describe the product..." />
            </div>
            <div>
              <Field label="Category" name="category" as="select" required>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </Field>
            </div>
            <div>
              <Field label="Sub-Category" name="subCategory" as="select" required>
                <option value="">Select sub-category</option>
                {(SUB_CATEGORIES[form.category] || []).map((s) => <option key={s}>{s}</option>)}
              </Field>
            </div>
            <div>
              <Field label="Fit" name="fit" as="select">
                {FITS.map((f) => <option key={f} value={f}>{f || 'Not specified'}</option>)}
              </Field>
            </div>
            <div><Field label="Fabric" name="fabric" placeholder="e.g. 100% Cotton, Premium Heavy Gauge Fabric" /></div>
            <div><Field label="Badge Text" name="badge" placeholder="e.g. NEW, TRENDING, SALE" /></div>
            <div className="flex items-center gap-3 pt-5">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
                className="w-4 h-4 accent-primary" />
              <label htmlFor="isFeatured" className="text-sm font-medium text-primary cursor-pointer">
                Feature on Homepage
              </label>
            </div>
          </div>
        </Section>

        {/* Pricing */}
        <Section title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field label="MRP (₹)" name="price" type="number" required placeholder="1299" />
            <Field label="Sale Price (₹)" name="discountPrice" type="number" placeholder="999 (optional)" />
          </div>
          {form.discountPrice && form.price && Number(form.discountPrice) < Number(form.price) && (
            <p className="text-green-600 text-xs mt-2 font-semibold">
              Discount: {Math.round(((form.price - form.discountPrice) / form.price) * 100)}% OFF
            </p>
          )}
        </Section>

        {/* Sizes & Stock */}
        <Section title="Sizes & Stock">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {sizes.map(({ size, stock }) => (
              <div key={size} className="text-center">
                <p className="text-xs font-bold text-primary mb-1">{size}</p>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => handleSizeStock(size, e.target.value)}
                  min={0}
                  className="w-full border border-gray-300 px-2 py-1.5 text-sm text-center focus:outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Set stock to 0 for unavailable sizes</p>
        </Section>

        {/* Colors */}
        <Section title="Colors">
          <div className="space-y-3">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => updateColor(i, 'hex', e.target.value)}
                  className="w-9 h-9 border border-gray-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateColor(i, 'name', e.target.value)}
                  placeholder="Color name (e.g. Midnight Black)"
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
                {colors.length > 1 && (
                  <button type="button" onClick={() => removeColor(i)} className="text-red-400 hover:text-red-600">
                    <FiX size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addColor}
            className="mt-3 flex items-center gap-1.5 text-sm text-primary font-semibold hover:text-accent transition-colors">
            <FiPlus size={14} /> Add Color
          </button>
        </Section>

        {/* Images */}
        <Section title="Product Images">
          {errors.images && <p className="text-accent text-xs mb-2">{errors.images}</p>}

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-20 h-24 object-cover object-top bg-gray-100 border" onError={(e) => { e.target.src = ''; }} />
                  <button type="button" onClick={() => removeExistingImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {previews.map((p, i) => (
                <div key={i} className="relative">
                  <img src={p} alt="" className="w-20 h-24 object-cover object-top bg-gray-100 border" />
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-primary py-8 cursor-pointer transition-colors">
            <FiUpload size={18} className="text-gray-400" />
            <span className="text-sm text-gray-500">Click to upload images (max 5MB each, up to 6)</span>
            <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
          </label>
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting} className="btn-primary px-10 py-3 disabled:opacity-60">
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary px-8 py-3">
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h3 className="font-display font-bold text-sm uppercase tracking-widest text-primary mb-5 pb-3 border-b border-gray-100">
        {title}
      </h3>
      {children}
    </div>
  );
}
