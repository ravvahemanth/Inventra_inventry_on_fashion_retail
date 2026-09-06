import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Search,
  RefreshCw,
  Shirt,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import axiosInstance from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';

function FashionStockManagement() {
  const navigate = useNavigate();
  const toast = useToast();
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Stock Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stockAction, setStockAction] = useState('STOCK_IN');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/fashion-products');
      setFashionProducts(res.data || []);
    } catch (err) {
      console.error('Error loading products for stock:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAdjustModal = (product, variant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant || product.variants?.[0] || null);
    setShowModal(true);
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      toast.warning('Please provide a valid unit count.');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/stock-transactions', {
        fashionProductId: selectedProduct.id,
        productId: selectedProduct.id,
        variantId: selectedVariant?.id,
        type: stockAction,
        quantity: parseInt(quantity, 10),
        reason: reason || 'Inventory ledger adjustment',
      });

      toast.success('Inventory ledger updated.');
      setShowModal(false);
      setQuantity('');
      setReason('');
      loadProducts();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update inventory levels.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = fashionProducts.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout
      title="Stock Control & Ledger"
      subtitle="Smart Fashion Retail Cloud • Real-Time Inventory Adjustments & Restock Actions"
    >
      <div className="space-y-6">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by piece title, brand, or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <button
            onClick={loadProducts}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-2xs"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Synchronize</span>
          </button>
        </div>

        {/* Stock Ledger Grid */}
        <div className="cloud-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold font-display tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Piece & SKU</th>
                  <th className="px-4 py-3.5">Brand</th>
                  <th className="px-4 py-3.5">Available Variants</th>
                  <th className="px-4 py-3.5">Floor Units</th>
                  <th className="px-4 py-3.5">Risk Status</th>
                  <th className="px-4 py-3.5 text-right">Ledger Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((product) => {
                  const totalStock = (product.variants || []).reduce((acc, v) => acc + (v.quantity || 0), 0);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                            <Shirt className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{product.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-800">{product.brand || 'Atelier'}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(product.variants || []).map((v, i) => (
                            <span
                              key={i}
                              onClick={() => openAdjustModal(product, v)}
                              className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 hover:border-indigo-400 cursor-pointer text-[10px] font-mono text-slate-700 font-semibold transition-colors"
                              title="Click to adjust this specific variant"
                            >
                              {v.size}/{v.color}: <strong className="text-slate-900">{v.quantity}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-sm text-slate-900">{totalStock}</td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          status={product.outOfStock ? 'Out of Stock' : product.lowStock ? 'Low Stock' : 'In Stock'}
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => openAdjustModal(product, product.variants?.[0])}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-all"
                        >
                          Adjust Units
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Dialog */}
        {showModal && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900">Floor Stock Transaction</h3>
                    <p className="text-xs text-slate-500 truncate max-w-[200px] font-medium">{selectedProduct.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                  ✕
                </button>
              </div>

              <form onSubmit={handleStockSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">Target Variant</label>
                  <select
                    value={selectedVariant?.id || ''}
                    onChange={(e) => {
                      const v = selectedProduct.variants?.find((item) => String(item.id) === e.target.value);
                      setSelectedVariant(v);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    {(selectedProduct.variants || []).map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.size} • {v.color} (Current: {v.quantity} units)
                      </option>
                    ))}
                  </select>
                </div>

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
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 50"
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-700">Audit Justification</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Inbound shipment arrival"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs disabled:opacity-50"
                  >
                    {submitting ? 'Updating...' : 'Post to Ledger'}
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

export default FashionStockManagement;