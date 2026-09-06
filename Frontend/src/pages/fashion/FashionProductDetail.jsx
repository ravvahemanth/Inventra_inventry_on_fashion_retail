import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Shirt,
  ArrowLeft,
  Edit3,
  Boxes,
  Tag,
  Sparkles,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import axiosInstance from '../../utils/axiosConfig';
import { getUserRole } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

function FashionProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const userRole = getUserRole();
  const isAdmin = userRole === 'ADMIN';
  const isManager = userRole === 'MANAGER' || isAdmin;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Stock Adjustment Modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState('STOCK_IN');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockReason, setStockReason] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/fashion-products/${id}`);
      setProduct(res.data);
      if (res.data?.variants?.length > 0) {
        setSelectedVariant(res.data.variants[0]);
      }
    } catch (err) {
      console.error('Error loading product detail:', err);
      toast.error('Fashion piece not found.');
      navigate('/fashion');
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    if (!stockQuantity || isNaN(stockQuantity) || Number(stockQuantity) <= 0) {
      toast.warning('Please specify a valid unit quantity.');
      return;
    }

    setAdjusting(true);
    try {
      await axiosInstance.post('/stock-transactions', {
        fashionProductId: product.id,
        productId: product.id,
        variantId: selectedVariant?.id,
        type: stockAction,
        quantity: parseInt(stockQuantity, 10),
        reason: stockReason || 'Manual adjustment via product detail ledger',
      });

      toast.success('Inventory ledger updated successfully.');
      setShowStockModal(false);
      setStockQuantity('');
      setStockReason('');
      loadProduct();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update inventory level.';
      toast.error(errorMsg);
    } finally {
      setAdjusting(false);
    }
  };

  if (loading || !product) {
    return (
      <AppLayout title="Product Specification Sheet">
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading fashion piece details...</p>
        </div>
      </AppLayout>
    );
  }

  const finalPrice = Number(product.basePrice || 0) + Number(selectedVariant?.priceAdjustment || 0);

  return (
    <AppLayout
      title={product.name}
      subtitle={`Product Reference: ${product.sku || 'SKU-00' + product.id} • ${product.brand || 'Atelier'}`}
    >
      <div className="space-y-6">
        {/* Top Navigation & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => navigate('/fashion')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Fashion Catalog</span>
          </button>

          <div className="flex items-center gap-3">
            {isManager && (
              <button
                onClick={() => setShowStockModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
              >
                <Boxes className="w-4 h-4" />
                <span>Adjust Stock Units</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => navigate(`/fashion/edit/${product.id}`)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Edit Piece</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Visual Artwork Showcase (1 col) */}
          <div className="space-y-6">
            <div className="cloud-card p-8 flex flex-col items-center justify-center relative min-h-[300px]">
              <div className="absolute top-4 left-4">
                <StatusBadge
                  status={product.outOfStock ? 'Out of Stock' : product.lowStock ? 'Low Stock' : 'In Stock'}
                />
              </div>

              {product.season && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700">
                  {product.season.replace('_', ' ')}
                </div>
              )}

              <Shirt className="w-32 h-32 text-indigo-300 drop-shadow-md" />

              <div className="mt-6 text-center">
                <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
                  {product.brand || 'Atelier'}
                </span>
                <h2 className="text-xl font-bold font-display text-slate-900 mt-0.5">{product.name}</h2>
                <p className="text-xs text-slate-400 font-mono mt-1">{product.sku}</p>
              </div>
            </div>

            {/* Quick Price Card */}
            <div className="cloud-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Calculated Variant Price
                  </span>
                  <p className="text-3xl font-bold font-mono text-slate-900 mt-0.5">
                    ₹{finalPrice.toLocaleString()}
                  </p>
                </div>
                {selectedVariant?.priceAdjustment > 0 && (
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    +₹{selectedVariant.priceAdjustment} Adjustment
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Selected Variant Stock</span>
                <span
                  className={`font-mono font-bold ${
                    (selectedVariant?.quantity || 0) === 0
                      ? 'text-rose-600'
                      : (selectedVariant?.quantity || 0) <= (selectedVariant?.minStockLevel || 5)
                      ? 'text-amber-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {selectedVariant?.quantity || 0} Units In Stock
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Variant Matrix & Specifications (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Variant Selector Matrix */}
            <div className="cloud-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Size & Color Variant Matrix
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {product.variants?.length || 0} Options Configured
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(product.variants || []).map((variant, idx) => {
                  const isSelected = selectedVariant?.id === variant.id || (!selectedVariant && idx === 0);

                  return (
                    <div
                      key={variant.id || idx}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold font-mono text-slate-900">{variant.size}</span>
                        <span className="text-[10px] uppercase font-bold text-indigo-700">
                          {variant.color}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">Floor:</span>
                        <span
                          className={`font-mono font-bold ${
                            variant.quantity === 0
                              ? 'text-rose-600'
                              : variant.quantity <= variant.minStockLevel
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {variant.quantity} units
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="cloud-card p-6 space-y-5">
              <h3 className="text-base font-bold font-display text-slate-900">Technical Specifications & Garment Care</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Product Category
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {product.category?.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Target Demographic
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {product.targetGender || 'Unisex'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Material Composition
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {product.material || 'Premium Fabric'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Garment Care Instructions
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {product.careInstructions || 'Dry clean recommended'}
                  </span>
                </div>
              </div>

              {product.description && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    Editorial Narrative
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 font-medium">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock Adjustment Modal */}
        {showStockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowStockModal(false)}
            />
            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900">Stock Adjustment</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedVariant?.size} • {selectedVariant?.color}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleStockUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">Transaction Action</label>
                  <select
                    value={stockAction}
                    onChange={(e) => setStockAction(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="STOCK_IN">Stock Inbound (Restock)</option>
                    <option value="STOCK_OUT">Stock Outbound (Sales / Transfer)</option>
                    <option value="DAMAGE_LOST">Damage / Shrinkage</option>
                    <option value="RETURN_RESTOCK">Customer Return Restock</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="e.g. 25"
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">Audit Justification</label>
                  <input
                    type="text"
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    placeholder="e.g. Delivery from central warehouse"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowStockModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adjusting}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {adjusting ? 'Submitting...' : 'Record Transaction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default FashionProductDetail;