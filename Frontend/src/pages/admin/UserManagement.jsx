import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  UserCheck,
  User,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import StatCard from '../../components/ui/StatCard';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { getAllUsers, approveUser, rejectUser, deleteUser } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

function UserManagement() {
  const navigate = useNavigate();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Confirm Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    isDestructive: false,
    onConfirm: () => {},
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data?.users || []);
    } catch (err) {
      toast.error('Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      toast.success('Manager access authorization granted.');
      loadUsers();
    } catch (err) {
      toast.error('Failed to approve user.');
    }
  };

  const confirmReject = (userId) => {
    setModalConfig({
      isOpen: true,
      title: 'Reject Manager Clearance',
      message: 'Are you sure you want to reject this manager access clearance request?',
      confirmText: 'Reject Request',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await rejectUser(userId);
          toast.info('Request rejected.');
          loadUsers();
        } catch (err) {
          toast.error('Failed to reject request.');
        }
      },
    });
  };

  const confirmDelete = (userId) => {
    setModalConfig({
      isOpen: true,
      title: 'Delete User Account',
      message: 'This user will permanently lose access to the INVENTRA workspace.',
      confirmText: 'Delete Account',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteUser(userId);
          toast.success('User account removed.');
          loadUsers();
        } catch (err) {
          toast.error('Failed to delete account.');
        }
      },
    });
  };

  const pendingManagers = users.filter((u) => u.role === 'MANAGER' && !u.approved);

  const filteredUsers = users.filter((u) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'PENDING' && !u.approved) ||
      (filter === 'ADMIN' && u.role === 'ADMIN') ||
      (filter === 'MANAGER' && u.role === 'MANAGER') ||
      (filter === 'STAFF' && u.role === 'STAFF');

    const matchesSearch =
      !searchTerm.trim() ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout
      title="Team & Security Administration"
      subtitle="Smart Fashion Retail Cloud • Role Clearances & Manager Authorization"
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Accounts"
            value={users.length}
            subtitle="Registered corporate users"
            icon={Users}
            accentColor="indigo"
          />
          <StatCard
            title="Pending Clearances"
            value={pendingManagers.length}
            subtitle="Managers awaiting review"
            icon={ShieldCheck}
            trend={pendingManagers.length > 0 ? 'Review Needed' : 'Cleared'}
            trendPositive={pendingManagers.length === 0}
            accentColor={pendingManagers.length > 0 ? 'amber' : 'emerald'}
          />
          <StatCard
            title="Store Managers"
            value={users.filter((u) => u.role === 'MANAGER').length}
            subtitle="Floor & stock oversight"
            icon={UserCheck}
            accentColor="sky"
          />
          <StatCard
            title="Floor Staff"
            value={users.filter((u) => u.role === 'STAFF').length}
            subtitle="Active sales personnel"
            icon={User}
            accentColor="emerald"
          />
        </div>

        {/* Filter Strip & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Users' },
              { id: 'PENDING', label: `Pending (${pendingManagers.length})` },
              { id: 'ADMIN', label: 'Admins' },
              { id: 'MANAGER', label: 'Managers' },
              { id: 'STAFF', label: 'Staff' },
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
              onClick={loadUsers}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 shrink-0 ml-1 shadow-2xs"
              title="Refresh users"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="cloud-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold font-display tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">User & Profile</th>
                  <th className="px-4 py-3.5">Corporate Email</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Clearance Status</th>
                  <th className="px-4 py-3.5 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading team members...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-500 font-medium">
                      No user accounts found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isPending = u.role === 'MANAGER' && !u.approved;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold font-display text-sm shrink-0">
                              {(u.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{u.username}</p>
                              <span className="text-[11px] text-slate-400 font-mono">User ID: #{u.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600 font-mono font-medium">{u.email}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              u.role === 'ADMIN'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : u.role === 'MANAGER'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5" /> Awaiting Clearance
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Authorized
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApprove(u.id)}
                                  className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                                  title="Authorize Account"
                                >
                                  Authorize
                                </button>
                                <button
                                  onClick={() => confirmReject(u.id)}
                                  className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                                  title="Reject Request"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => confirmDelete(u.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        isDestructive={modalConfig.isDestructive}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </AppLayout>
  );
}

export default UserManagement;
