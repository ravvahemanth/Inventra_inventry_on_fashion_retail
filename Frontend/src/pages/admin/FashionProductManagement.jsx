import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Shirt,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Save,
  Layers,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import axiosInstance from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';

function FashionProductManagement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'CLOTHING_MENS',
    brand: '',
    basePrice: '',
    season: 'ALL_SEASON',
    targetGender: 'UNISEX',
    material: '',
    careInstructions: '',
    variants: [
      {
        size: 'M',
        color: 'BLACK',
        quantity: 10,
        minStockLevel: 5,
        priceAdjustment: 0,
      },
    ],
  });

  const categories = [
    { value: 'CLOTHING_MENS', label: "Men's Apparel" },
    { value: 'CLOTHING_WOMENS', label: "Women's Collection" },
    { value: 'CLOTHING_KIDS', label: "Kids' Collection" },
    { value: 'FOOTWEAR_MENS', label: "Men's Footwear" },
    { value: 'FOOTWEAR_WOMENS', label: "Women's Footwear" },
    { value: 'FOOTWEAR_KIDS', label: "Kids' Footwear" },
    { value: 'ACCESSORIES_BAGS', label: 'Bags & Purses' },
    { value: 'ACCESSORIES_JEWELRY', label: 'Jewelry' },
    { value: 'ACCESSORIES_WATCHES', label: 'Watches' },
    { value: 'ACCESSORIES_SUNGLASSES', label: 'Eyewear' },
  ];

  const seasons = [
    { value: 'ALL_SEASON', label: 'All Season' },
    { value: 'SPRING', label: 'Spring' },
    { value: 'SUMMER', label: 'Summer' },
    { value: 'AUTUMN', label: 'Autumn' },
    { value: 'WINTER', label: 'Winter' },
  ];

  const genders = [
    { value: 'UNISEX', label: 'Unisex' },
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'KIDS', label: 'Kids' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43', '44', 'ONESIZE'];
  const colors = ['BLACK', 'WHITE', 'NAVY', 'BEIGE', 'EMERALD', 'BURGUNDY', 'CHARCOAL', 'GOLD', 'SILVER'];

  useEffect(() => {
    if (isEditMode) {
      loadProductForEdit();
    }
  }, [id]);

  const loadProductForEdit = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/fashion-products/${id}`);
      const p = res.data;
      setFormData({
        name: p.name || '',
        description: p.description || '',
        category: p.category || 'CLOTHING_MENS',
        brand: p.brand || '',
        basePrice: p.basePrice || '',
        season: p.season || 'ALL_SEASON',
        targetGender: p.targetGender || 'UNISEX',
        material: p.material || '',
        careInstructions: p.careInstructions || '',
        variants: p.variants?.length ? p.variants : formData.variants,
      });
    } catch (err) {
      toast.error('Failed to load product data.');
      navigate('/fashion');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const addVariantRow = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          size: 'M',
          color: 'BLACK',
          quantity: 10,
          minStockLevel: 5,
          priceAdjustment: 0,
        },
      ],
    });
  };

  const removeVariantRow = (index) => {
    if (formData.variants.length <= 1) {
      toast.warning('A product must have at least one variant.');
      return;
    }
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.basePrice) {
      toast.warning('Please complete all required product fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        variants: formData.variants.map((v) => ({
          ...v,
          quantity: parseInt(v.quantity, 10),
          minStockLevel: parseInt(v.minStockLevel, 10),
          priceAdjustment: parseFloat(v.priceAdjustment || 0),
        })),
      };

      if (isEditMode) {
        await axiosInstance.put(`/fashion-products/${id}`, payload);
        toast.success('Fashion product updated successfully.');
      } else {
        await axiosInstance.post('/fashion-products', payload);
        toast.success('New fashion item registered in catalog.');
      }

      setTimeout(() => {
        navigate('/fashion');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error saving product.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title={isEditMode ? 'Edit Fashion Item' : 'Add New Fashion Item'}
      subtitle="Smart Fashion Retail Cloud • Catalog Specification & Variant Registration"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Navigation & Actions Top Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/fashion')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Return</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isEditMode ? 'Save Changes' : 'Publish to Catalog'}</span>
          </button>
        </div>

        {/* Section 1: Basic Information */}
        <div className="cloud-card p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Shirt className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-display text-slate-900">General Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Piece Title / Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Classic Trench Coat"
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Brand / Atelier *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g. Maison Laurent"
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Base Price (INR) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                placeholder="e.g. 4999.00"
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Collection Season</label>
              <select
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                {seasons.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Target Demographic</label>
              <select
                name="targetGender"
                value={formData.targetGender}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                {genders.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Material Composition</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="e.g. 100% Cotton, Denim"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Care Instructions</label>
              <input
                type="text"
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleInputChange}
                placeholder="e.g. Machine wash cold, tumble dry low"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Product Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Details on product style, silhouette, and fabric..."
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Variant Matrix Builder */}
        <div className="cloud-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Variant Matrix (Sizes & Colors)</h3>
                <p className="text-xs text-slate-500 font-medium">Configure initial inventory levels per size and color</p>
              </div>
            </div>

            <button
              type="button"
              onClick={addVariantRow}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold font-display border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Size</th>
                  <th className="px-3 py-2.5">Color</th>
                  <th className="px-3 py-2.5">Initial Stock</th>
                  <th className="px-3 py-2.5">Min Alert Threshold</th>
                  <th className="px-3 py-2.5">Price Delta (+₹)</th>
                  <th className="px-3 py-2.5 text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.variants.map((v, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5">
                      <select
                        value={v.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                      >
                        {sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      <select
                        value={v.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                      >
                        {colors.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        min="0"
                        value={v.quantity}
                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                        className="w-20 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        min="1"
                        value={v.minStockLevel}
                        onChange={(e) => handleVariantChange(index, 'minStockLevel', e.target.value)}
                        className="w-20 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        step="0.01"
                        value={v.priceAdjustment}
                        onChange={(e) => handleVariantChange(index, 'priceAdjustment', e.target.value)}
                        className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => removeVariantRow(index)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </AppLayout>
  );
}

export default FashionProductManagement;