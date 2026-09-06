import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import axiosInstance from '../../utils/axiosConfig';

function AdminTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/stock-transactions');
      setTransactions(res.data || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const inbound = transactions.filter((t) => t.type === 'STOCK_IN');
  const outbound = transactions.filter((t) => t.type === 'STOCK_OUT');
  const totalQtyIn = inbound.reduce((sum, t) => sum + (t.quantity || 0), 0);
  const totalQtyOut = outbound.reduce((sum, t) => sum + (t.quantity || 0), 0);

  const filtered = transactions.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch =
      !searchTerm.trim() ||
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout
      title="Audit Ledger"
      subtitle="Smart Fashion Retail Cloud • Immutable Stock Inflow, Outflow & Discrepancy Records"
    >
      <div className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Events Logged"
            value={transactions.length}
            subtitle="All audit entries"
            icon={ArrowLeftRight}
            accentColor="indigo"
          />
          <StatCard
            title="Inbound Restocked"
            value={totalQtyIn}
            subtitle={`${inbound.length} Shipments received`}
            icon={ArrowDownLeft}
            accentColor="emerald"
          />
          <StatCard
            title="Outbound Dispatched"
            value={totalQtyOut}
            subtitle={`${outbound.length} Retail distributions`}
            icon={ArrowUpRight}
            accentColor="sky"
          />
          <StatCard
            title="Net Stock Variance"
            value={totalQtyIn - totalQtyOut}
            subtitle="Units floor delta"
            icon={TrendingUp}
            accentColor="amber"
          />
        </div>

        {/* Filter Strip & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by piece, staff, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'STOCK_IN', label: 'Inbound' },
              { id: 'STOCK_OUT', label: 'Outbound' },
              { id: 'DAMAGE_LOST', label: 'Damage' },
              { id: 'RETURN_RESTOCK', label: 'Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={loadTransactions}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 shrink-0 ml-1 shadow-2xs"
              title="Refresh ledger"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Transactions Ledger Table */}
        <div className="cloud-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold font-display tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Fashion Piece</th>
                  <th className="px-4 py-3.5">Movement Type</th>
                  <th className="px-4 py-3.5">Units</th>
                  <th className="px-4 py-3.5">Executive / Staff</th>
                  <th className="px-5 py-3.5">Audit Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Auditing transaction ledger...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500 font-medium">
                      No stock transactions recorded matching this filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 text-slate-500 font-mono whitespace-nowrap">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Recent'}
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-900">
                        <p>{item.productName || 'Fashion Item'}</p>
                        {item.variantDetails && (
                          <span className="text-[11px] text-indigo-600 font-mono font-semibold">{item.variantDetails}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={item.type} />
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-sm">
                        <span
                          className={
                            item.type === 'STOCK_IN'
                              ? 'text-emerald-600'
                              : item.type === 'STOCK_OUT'
                              ? 'text-sky-600'
                              : 'text-rose-600'
                          }
                        >
                          {item.type === 'STOCK_IN' ? '+' : '-'}
                          {item.quantity} units
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700 flex items-center gap-2 font-medium">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                          {(item.username || 'E').charAt(0).toUpperCase()}
                        </div>
                        <span>{item.username || 'System User'}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 max-w-xs truncate font-medium">
                        {item.reason || 'Floor adjustment'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminTransactions;