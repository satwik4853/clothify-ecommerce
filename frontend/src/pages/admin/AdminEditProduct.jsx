import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';
import ProductForm from './ProductForm';
import AdminLayout from '../../components/common/AdminLayout';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.product);
      } catch {
        toast.error('Product not found');
        navigate('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  if (loading) return <AdminLayout title="Edit Product"><Loader /></AdminLayout>;
  if (!product) return null;

  return <ProductForm initialData={product} productId={id} />;
}
