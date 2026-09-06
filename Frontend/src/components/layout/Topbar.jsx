import React from 'react';
import { Menu, Bell, CloudCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../../services/authService';

function Topbar({ onMenuClick, title, subtitle, alertCount = 0 }) {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const username = localStorage.getItem('username') || 'Executive';
  const isAdmin = userRole === 'ADMIN';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            {title || 'Dashboard'}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 hidden sm:block mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right section: Cloud status & Alerts */}
      <div className="flex items-center gap-3">
        {/* System Online Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Retail Cloud Live</span>
        </div>

        {/* Alerts shortcut */}
        <button
          onClick={() => navigate(isAdmin ? '/admin/alerts' : '/alerts')}
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Stock Alerts"
        >
          <Bell className="w-5 h-5" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Mini Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-semibold text-slate-800 hidden sm:block">{username}</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
