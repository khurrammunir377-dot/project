import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
    variant?: 'success' | 'warning' | 'danger' | 'info';
  };
  subtitle?: string;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
  href?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  colorScheme = 'indigo',
  href,
}) => {
  const iconBgs = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
  };

  // Determine pill badge styling
  let badgeClasses = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/80';
  if (trend) {
    if (trend.variant === 'warning' || trend.value.toLowerCase().includes('action') || trend.value.toLowerCase().includes('pending')) {
      badgeClasses = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/80';
    } else if (!trend.positive || trend.variant === 'danger') {
      badgeClasses = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/80';
    }
  }

  const cardContent = (
    <div
      className={`relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-200 ${
        href
          ? 'hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600/80 hover:-translate-y-0.5 cursor-pointer group'
          : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          {title}
          {href && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
          )}
        </span>
        <div className={`p-2.5 rounded-xl transition-transform ${href ? 'group-hover:scale-105' : ''} ${iconBgs[colorScheme]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
          {value}
        </h4>

        {trend && (
          <div
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border shadow-xs shrink-0 ${badgeClasses}`}
          >
            {trend.positive ? (
              <TrendingUp className="w-3 h-3 mr-1 shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1 shrink-0" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

