import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  accentColor = 'indigo', // 'indigo', 'emerald', 'amber', 'rose', 'sky'
}) {
  const getAccentStyles = () => {
    switch (accentColor) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'amber':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rose':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'sky':
        return 'bg-sky-50 text-sky-600 border-sky-100';
      default:
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  const iconStyle = getAccentStyles();

  return (
    <div className="cloud-card p-5 sm:p-6 cloud-card-hover flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl border ${iconStyle} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
          {subtitle && <span className="text-slate-500 font-medium truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold shrink-0 px-2 py-0.5 rounded-full text-[11px] ${
                trendPositive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;
