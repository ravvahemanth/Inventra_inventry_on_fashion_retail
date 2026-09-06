import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  BellRing,
  Shirt,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import axiosInstance from '../../utils/axiosConfig';

function ManagerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    products: [],
    recentTransactions: [],
    alerts: [],
    stats: {},
  });
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadManagerData();
  }, []);

  const loadManagerData = async () => {
    try {
      setLoading(true);
      const [dashRes, fashionRes] = await Promise.allSettled([
        axiosInstance.get('/dashboard/manager'),
        axiosInstance.get('/fashion-products'),
      ]);

      if (dashRes.status === 'fulfilled') {
        setDashboardData(dashRes.value.data || {});
      }
      if (fashionRes.status === 'fulfilled') {
        setFashionProducts(fashionRes.value.data || []);
      }
    } catch (err) {
      console.error('Error loading manager dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeAlerts = (dashboardData.alerts || []).filter((a) => a.status === 'ACTIVE');
  const alertCount = activeAlerts.length;

  const lowStockCount = fashionProducts.filter((p) => p.lowStock).length;
  const outOfStockCount = fashionProducts.filter((p) => p.outOfStock).length;

  return (
    <AppLayout
      title="Store Operations Dashboard"
      subtitle="Smart Fashion Retail Cloud • Floor Stock Level Management"
      alertCount={alertCount}
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Collection"
            value={fashionProducts.length}
            subtitle="Active Fashion Styles"
            icon={Shirt}
            accentColor="indigo"
          />
          <StatCard
            title="Active Risk Incidents"
            value={alertCount}
            subtitle="Immediate Floor Attention"
            icon={BellRing}
            accentColor={alertCount > 0 ? 'rose' : 'emerald'}
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockCount}
            subtitle="Approaching Reorder Limit"
            icon={AlertTriangle}
            accentColor={lowStockCount > 0 ? 'amber' : 'emerald'}
          />
          <StatCard
            title="Depleted Out of Stock"
            value={outOfStockCount}
            subtitle="Zero Available Units"
            icon={Boxes}
            accentColor={outOfStockCount > 0 ? 'rose' : 'emerald'}
          />
        </div>

        {/* Quick Operations Callout */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">Floor Inventory Adjustments</h4>
              <p className="text-xs text-slate-600 font-medium">Record restock shipments or adjust inventory balances directly</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/manager/stock')}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Boxes className="w-4 h-4" />
            <span>Launch Stock Control Ledger</span>
          </button>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fashion Inventory Health (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Inventory Status Overview</h3>
                <p className="text-xs text-slate-500 font-medium">Apparel and accessories requiring floor action</p>
              </div>
              <button
                onClick={() => navigate('/fashion')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="cloud-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold font-display tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-4 py-3.5">Brand</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {fashionProducts.slice(0, 6).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-900">
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{item.sku || 'SKU-00' + item.id}</p>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">{item.brand || 'Atelier'}</td>
                        <td className="px-4 py-3.5 text-slate-500">{item.category?.replace('_', ' ')}</td>
                        <td className="px-4 py-3.5">
                          <StatusBadge
                            status={item.outOfStock ? 'Out of Stock' : item.lowStock ? 'Low Stock' : 'In Stock'}
                          />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => navigate('/manager/stock')}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Active Risks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Active Stock Alerts
              </h3>
              <button
                onClick={() => navigate('/alerts')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View All →
              </button>
            </div>

            <div className="cloud-card p-4 space-y-3">
              {activeAlerts.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">Zero Inventory Risks</p>
                  <p className="text-[11px] text-slate-500">All sizes and colors are currently stocked above threshold.</p>
                </div>
              ) : (
                activeAlerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-slate-300"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{alert.productName || alert.message}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Min Threshold: {alert.threshold || 5} • Available: <strong className="text-rose-600">{alert.currentStock || 0}</strong>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default ManagerDashboard;