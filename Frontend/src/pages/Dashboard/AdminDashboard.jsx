import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shirt,
  Boxes,
  BellRing,
  AlertTriangle,
  Users,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import axiosInstance from '../../utils/axiosConfig';
import { approveUser, rejectUser } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

function AdminDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const [dashboardData, setDashboardData] = useState({
    products: [],
    recentTransactions: [],
    alerts: [],
    stats: {},
  });
  const [fashionProducts, setFashionProducts] = useState([]);
  const [fashionStats, setFashionStats] = useState({
    totalProducts: 0,
    totalBrands: 0,
    totalVariants: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dashRes, fashionRes, pendingRes] = await Promise.allSettled([
        axiosInstance.get('/dashboard/admin'),
        axiosInstance.get('/fashion-products'),
        axiosInstance.get('/admin/pending-users'),
      ]);

      if (dashRes.status === 'fulfilled') {
        setDashboardData(dashRes.value.data || {});
      }

      if (fashionRes.status === 'fulfilled') {
        const products = fashionRes.value.data || [];
        setFashionProducts(products);

        const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
        const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
        const lowStock = products.filter((p) => p.lowStock).length;
        const outOfStock = products.filter((p) => p.outOfStock).length;

        setFashionStats({
          totalProducts: products.length,
          totalBrands: brands.length,
          totalVariants,
          lowStockProducts: lowStock,
          outOfStockProducts: outOfStock,
        });
      }

      if (pendingRes.status === 'fulfilled') {
        setPendingUsers(pendingRes.value.data?.users || []);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      toast.success('Manager access clearance granted.');
      loadAllData();
    } catch (err) {
      toast.error('Failed to approve manager account.');
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectUser(userId);
      toast.info('Manager request rejected.');
      loadAllData();
    } catch (err) {
      toast.error('Failed to reject manager account.');
    }
  };

  const activeAlerts = (dashboardData.alerts || []).filter((a) => a.status === 'ACTIVE');
  const alertCount = activeAlerts.length;

  return (
    <AppLayout
      title="Executive Overview"
      subtitle="Smart Fashion Retail Cloud • Inventory Operations & Risk Monitoring"
      alertCount={alertCount}
    >
      <div className="space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Collection"
            value={fashionStats.totalProducts || dashboardData.stats?.totalProducts || 0}
            subtitle={`${fashionStats.totalBrands} Brands Registered`}
            icon={Shirt}
            accentColor="indigo"
          />
          <StatCard
            title="Stock Units"
            value={dashboardData.stats?.totalStock || fashionStats.totalVariants * 12 || 0}
            subtitle={`${fashionStats.totalVariants} SKU Variants`}
            icon={Boxes}
            accentColor="emerald"
          />
          <StatCard
            title="Stock Risks"
            value={alertCount}
            subtitle={`${fashionStats.outOfStockProducts} depleted, ${fashionStats.lowStockProducts} warning`}
            icon={BellRing}
            trend={alertCount > 0 ? 'Attention' : 'Healthy'}
            trendPositive={alertCount === 0}
            accentColor={alertCount > 0 ? 'rose' : 'emerald'}
          />
          <StatCard
            title="Pending Clearances"
            value={pendingUsers.length}
            subtitle="Managers awaiting approval"
            icon={Users}
            accentColor={pendingUsers.length > 0 ? 'amber' : 'emerald'}
          />
        </div>

        {/* Pending Approvals Notice Banner (If Any) */}
        {pendingUsers.length > 0 && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display text-slate-900">
                    {pendingUsers.length} Manager Account{pendingUsers.length > 1 ? 's' : ''} Awaiting Clearance
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Store managers cannot access stock features until authorized by an administrator.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/users')}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm"
              >
                Review in Team Portal
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-amber-200/80">
              {pendingUsers.slice(0, 2).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user.username}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-Column Grid: Featured Catalog & Risk Sentinel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Featured Fashion Pieces (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-slate-900">Featured Fashion Pieces</h3>
                <p className="text-xs text-slate-500 font-medium">Real-time status of apparel and accessories</p>
              </div>
              <button
                onClick={() => navigate('/fashion')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="cloud-card overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-medium">Loading collection...</p>
                </div>
              ) : fashionProducts.length === 0 ? (
                <div className="p-12 text-center text-slate-500 space-y-3">
                  <Package className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-sm font-bold text-slate-800">No products registered</p>
                  <button
                    onClick={() => navigate('/admin/fashion/add')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4" /> Add First Product
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold font-display tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Product & SKU</th>
                        <th className="px-4 py-3.5">Brand</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Base Price</th>
                        <th className="px-4 py-3.5">Variants</th>
                        <th className="px-4 py-3.5">Stock Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {fashionProducts.slice(0, 6).map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => navigate(`/fashion/product/${item.id}`)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                        >
                          <td className="px-5 py-3.5 font-medium text-slate-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                              <Shirt className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono">{item.sku || 'SKU-00' + item.id}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800">{item.brand || 'Atelier'}</td>
                          <td className="px-4 py-3.5 text-slate-500">{item.category?.replace('_', ' ')}</td>
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                            ₹{Number(item.basePrice || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
                              {item.variants?.length || 0} Options
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge
                              status={item.outOfStock ? 'Out of Stock' : item.lowStock ? 'Low Stock' : 'In Stock'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Risks & Operations Launchpad */}
          <div className="space-y-6">
            {/* Active Risks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Active Stock Risks
                </h3>
                <button
                  onClick={() => navigate('/admin/alerts')}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Manage Alerts →
                </button>
              </div>

              <div className="cloud-card p-4 space-y-2.5">
                {activeAlerts.length === 0 ? (
                  <div className="py-6 text-center text-slate-500 space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">All Levels Nominal</p>
                    <p className="text-[11px] text-slate-500">All fashion variants are within safe stock limits.</p>
                  </div>
                ) : (
                  activeAlerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{alert.productName || alert.message}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Threshold: {alert.threshold || 5} • Available: <strong className="text-rose-600">{alert.currentStock || 0}</strong>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Operations Launchpad */}
            <div className="cloud-card p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                Quick Operations
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/admin/fashion/add')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-indigo-600" /> Add New Fashion Item
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => navigate('/admin/fashion-stock')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-indigo-600" /> Fast Stock In / Out Ledger
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" /> Manage Team Permissions
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminDashboard;