import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  className = '',
  trend,
}) => {
  return (
    <div
      className={`bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300/90 transition-all duration-200 flex items-start justify-between group relative overflow-hidden ${className}`}
    >
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
          {value}
        </p>

        {description && (
          <p className="mt-1 text-[11px] text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        )}

        {trend && (
          <div className="mt-1.5 flex items-center space-x-1.5">
            <span
              className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                  : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
              }`}
            >
              {trend.value}
            </span>
          </div>
        )}
      </div>

      {icon && (
        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/80 border border-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 group-hover:shadow-sm transition-all duration-200 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
          {icon}
        </div>
      )}
    </div>
  );
};
export default StatCard;
