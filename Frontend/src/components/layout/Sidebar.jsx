import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  BellRing,
  ArrowLeftRight,
  Users,
  PlusCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
  UserCheck,
  User,
  X,
  Cloud,
} from 'lucide-react';
import { getUserRole, logout } from '../../services/authService';

function Sidebar({ isOpen, onClose, alertCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();
  const username = localStorage.getItem('username') || 'Executive';
  const userEmail = localStorage.getItem('userEmail') || '';

  const isAdmin = userRole === 'ADMIN';
  const isManager = userRole === 'MANAGER';

  const navItems = [
    {
      name: 'Overview Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'MANAGER', 'STAFF'],
    },
    {
      name: 'Fashion Catalog',
      path: '/fashion',
      icon: Shirt,
      roles: ['ADMIN', 'MANAGER', 'STAFF'],
    },
    {
      name: 'Stock Control',
      path: isAdmin ? '/admin/fashion-stock' : '/manager/stock',
      icon: Boxes,
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      name: 'Stock Alerts',
      path: isAdmin ? '/admin/alerts' : '/alerts',
      icon: BellRing,
      roles: ['ADMIN', 'MANAGER'],
      badge: alertCount > 0 ? alertCount : null,
    },
    {
      name: 'Audit Ledger',
      path: isAdmin ? '/admin/transactions' : '/transactions',
      icon: ArrowLeftRight,
      roles: ['ADMIN', 'MANAGER'],
    },
    {
      name: 'Team & Security',
      path: '/admin/users',
      icon: Users,
      roles: ['ADMIN'],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ShieldCheck className="w-3 h-3" /> Admin
        </span>
      );
    }
    if (isManager) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <UserCheck className="w-3 h-3" /> Manager
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <User className="w-3 h-3" /> Floor Staff
      </span>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold font-display tracking-tight text-slate-900 flex items-center gap-1">
                INVENTRA
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 block -mt-0.5 tracking-wide">
                Smart Fashion Retail Cloud
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button for Admin */}
        {isAdmin && (
          <div className="px-4 pt-4 pb-1">
            <button
              onClick={() => {
                navigate('/admin/fashion/add');
                onClose?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 mb-2 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{username}</p>
              <div className="mt-0.5">{getRoleBadge()}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
