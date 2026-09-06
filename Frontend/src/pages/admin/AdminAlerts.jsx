import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Boxes,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import axiosInstance from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';

function AdminAlerts() {
  const navigate = useNavigate();
  const toast = useToast();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  // Delete Confirm Modal State
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/fashion-alerts');
      setAlerts(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error loading alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await axiosInstance.put(`/fashion-alerts/${alertId}/resolve`);
      toast.success('Alert marked as resolved.');
      loadAlerts();
    } catch (err) {
      toast.error('Failed to resolve alert.');
    }
  };

  const confirmDelete = (alertId) => {
    setDeleteId(alertId);
    setShowDeleteModal(true);
  };

  const handleDeleteAlert = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`/fashion-alerts/${deleteId}`);
      toast.info('Alert record purged from sentinel.');
      loadAlerts();
    } catch (err) {
      toast.error('Failed to purge alert record.');
    } finally {
      setDeleteId(null);
      setShowDeleteModal(false);
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const lowStock = activeAlerts.filter((a) => a.type === 'LOW_STOCK');
  const outOfStock = activeAlerts.filter((a) => a.type === 'OUT_OF_STOCK');
  const resolved = alerts.filter((a) => a.status === 'RESOLVED');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'ACTIVE') return a.status === 'ACTIVE';
    if (filter === 'LOW_STOCK') return a.type === 'LOW_STOCK' && a.status === 'ACTIVE';
    if (filter === 'OUT_OF_STOCK') return a.type === 'OUT_OF_STOCK' && a.status === 'ACTIVE';
    if (filter === 'RESOLVED') return a.status === 'RESOLVED';
    return true;
  });

  return (
    <AppLayout
      title="Stock Risk & Alerts"
      subtitle="Smart Fashion Retail Cloud • Automated Threshold Alerts & Low Stock Mitigation"
      alertCount={activeAlerts.length}
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Alert Log"
            value={alerts.length}
            subtitle="Historical risk logs"
            icon={BellRing}
            accentColor="indigo"
          />
          <StatCard
            title="Active Incidents"
            value={activeAlerts.length}
            subtitle="Requires floor restock"
            icon={AlertTriangle}
            accentColor={activeAlerts.length > 0 ? 'rose' : 'emerald'}
          />
          <StatCard
            title="Depleted Out of Stock"
            value={outOfStock.length}
            subtitle="Zero units on hand"
            icon={Boxes}
            accentColor={outOfStock.length > 0 ? 'rose' : 'emerald'}
          />
          <StatCard
            title="Resolved Incidents"
            value={resolved.length}
            subtitle="Restocked & cleared"
            icon={CheckCircle2}
            accentColor="emerald"
          />
        </div>

        {/* Filter Strip & Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Incidents' },
              { id: 'ACTIVE', label: `Active Risks (${activeAlerts.length})` },
              { id: 'OUT_OF_STOCK', label: `Out of Stock (${outOfStock.length})` },
              { id: 'LOW_STOCK', label: `Low Stock (${lowStock.length})` },
              { id: 'RESOLVED', label: `Resolved (${resolved.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filter === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadAlerts}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shrink-0 shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Alerts</span>
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Evaluating inventory levels...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="py-16 text-center space-y-2 cloud-card p-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold font-display text-slate-900">All Levels Nominal</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                No active incidents found matching your current filter criteria.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isResolved = alert.status === 'RESOLVED';
              const isOut = alert.type === 'OUT_OF_STOCK';

              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
                    isResolved
                      ? 'bg-slate-50 border-slate-200 opacity-70'
                      : isOut
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl border shrink-0 ${
                        isResolved
                          ? 'bg-white text-slate-500 border-slate-200'
                          : isOut
                          ? 'bg-white text-rose-600 border-rose-200 shadow-2xs'
                          : 'bg-white text-amber-600 border-amber-200 shadow-2xs'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 font-display">
                          {alert.productName || 'Fashion Item Alert'}
                        </h4>
                        <StatusBadge status={alert.status} />
                        {alert.type && (
                          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-600">
                            {alert.type}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {alert.message ||
                          `Current floor stock (${alert.currentStock || 0}) is below minimum threshold limit (${
                            alert.threshold || 5
                          }).`}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                        <span>Threshold Limit: <strong className="text-slate-800">{alert.threshold || 5}</strong></span>
                        <span>Available Units: <strong className="text-rose-600 font-bold">{alert.currentStock || 0}</strong></span>
                        {alert.createdAt && <span>Recorded: {new Date(alert.createdAt).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!isResolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all"
                      >
                        Acknowledge & Clear
                      </button>
                    )}
                    <button
                      onClick={() => confirmDelete(alert.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Purge Incident"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Purge Incident Record"
        message="Are you sure you want to delete this alert record from the incident log?"
        confirmText="Purge Alert"
        isDestructive
        onConfirm={handleDeleteAlert}
        onCancel={() => setShowDeleteModal(false)}
      />
    </AppLayout>
  );
}

export default AdminAlerts;
