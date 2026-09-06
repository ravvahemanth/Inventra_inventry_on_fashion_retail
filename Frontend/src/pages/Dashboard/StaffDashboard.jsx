import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, Search, Boxes, ArrowRight, Package, Sparkles } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import axiosInstance from '../../utils/axiosConfig';

function StaffDashboard() {
  const navigate = useNavigate();
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/fashion-products');
      setFashionProducts(res.data || []);
    } catch (err) {
      console.error('Error loading staff catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = fashionProducts.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout
      title="Floor Staff Portal"
      subtitle="Smart Fashion Retail Cloud • Real-Time Variant Inquiries & Product Specifications"
    >
      <div className="space-y-6">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <StatCard
            title="Total Collection"
            value={fashionProducts.length}
            subtitle="Available in catalog"
            icon={Shirt}
            accentColor="indigo"
          />
          <StatCard
            title="Available In-Stock"
            value={fashionProducts.filter((p) => !p.outOfStock).length}
            subtitle="Ready for floor sales"
            icon={Boxes}
            accentColor="emerald"
          />
          <StatCard
            title="Depleted Out of Stock"
            value={fashionProducts.filter((p) => p.outOfStock).length}
            subtitle="Notify store manager"
            icon={Package}
            accentColor="rose"
          />
        </div>

        {/* Search & Lookup Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Instant Floor Lookup: Search product name, SKU, or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.slice(0, 9).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/fashion/product/${item.id}`)}
              className="cloud-card p-5 cloud-card-hover cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <Shirt className="w-5 h-5" />
                </div>
                <StatusBadge
                  status={item.outOfStock ? 'Out of Stock' : item.lowStock ? 'Low Stock' : 'In Stock'}
                />
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{item.brand || 'Atelier'}</p>
                <h4 className="text-base font-bold font-display text-slate-900 mt-0.5 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{item.sku || 'SKU-00' + item.id}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-900 text-sm">₹{Number(item.basePrice || 0).toLocaleString()}</span>
                <span className="text-slate-500 font-medium">{item.variants?.length || 0} Variant Options</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default StaffDashboard;