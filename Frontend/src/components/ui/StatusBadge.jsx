import React from 'react';

function StatusBadge({ status }) {
  const getConfig = () => {
    switch (status) {
      case 'IN_STOCK':
      case 'In Stock':
        return {
          label: 'In Stock',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'LOW_STOCK':
      case 'Low Stock':
        return {
          label: 'Low Stock',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'OUT_OF_STOCK':
      case 'Out of Stock':
        return {
          label: 'Out of Stock',
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-500',
        };

      // Alert Statuses
      case 'ACTIVE':
        return {
          label: 'Active Risk',
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-500 animate-ping',
        };
      case 'RESOLVED':
        return {
          label: 'Resolved',
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          dot: 'bg-slate-400',
        };

      // Transaction Types
      case 'STOCK_IN':
        return {
          label: 'Inbound Restock',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'STOCK_OUT':
        return {
          label: 'Outbound Dispatched',
          bg: 'bg-sky-50',
          text: 'text-sky-700',
          border: 'border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'DAMAGE_LOST':
        return {
          label: 'Damage / Shrinkage',
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'RETURN_RESTOCK':
        return {
          label: 'Customer Return',
          bg: 'bg-indigo-50',
          text: 'text-indigo-700',
          border: 'border-indigo-200',
          dot: 'bg-indigo-500',
        };

      default:
        return {
          label: status || 'General',
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const config = getConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}

export default StatusBadge;
