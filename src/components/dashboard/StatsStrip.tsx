'use client';

import { TrendingUp, TrendingDown, CreditCard, Wallet, Activity } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatCard {
  id: string;
  label: string;
  value: string;
  sub: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: StatCard[] = [
  {
    id: 'stat-total-balance',
    label: 'Wallet Balance',
    value: '$1,250.00',
    sub: 'USDT',
    trend: 'up',
    trendValue: '+12.4% this month',
    icon: Wallet,
    iconColor: 'text-[#10B981]',
    iconBg: 'bg-[#ECFDF5]',
  },
  {
    id: 'stat-active-cards',
    label: 'Active Cards',
    value: '3',
    sub: 'of 5 issued',
    trend: 'neutral',
    trendValue: '1 frozen',
    icon: CreditCard,
    iconColor: 'text-[#3B82F6]',
    iconBg: 'bg-[#EFF6FF]',
  },
  {
    id: 'stat-monthly-spent',
    label: 'Monthly Spend',
    value: '$385.97',
    sub: 'Jun 2026',
    trend: 'down',
    trendValue: '-8.2% vs May',
    icon: TrendingDown,
    iconColor: 'text-[#F59E0B]',
    iconBg: 'bg-[#FFFBEB]',
  },
  {
    id: 'stat-transactions',
    label: 'Transactions',
    value: '124',
    sub: 'this month',
    trend: 'up',
    trendValue: '+31 vs May',
    icon: Activity,
    iconColor: 'text-[#8B5CF6]',
    iconBg: 'bg-[#F5F3FF]',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Activity;
        const trendColor =
          stat.trend === 'up'
            ? 'text-[#10B981]'
            : stat.trend === 'down'
            ? 'text-[#F59E0B]'
            : 'text-[#94A3B8]';

        return (
          <div key={stat.id} id={stat.id} className="card p-4 md:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <Icon className={`w-4.5 h-4.5 ${stat.iconColor}`} strokeWidth={2} />
              </div>
              <div className={`flex items-center gap-1 ${trendColor}`}>
                <TrendIcon className="w-3 h-3" strokeWidth={2.5} />
                <span className="text-[10px] font-semibold">{stat.trendValue}</span>
              </div>
            </div>

            <p className="text-xl md:text-2xl font-bold text-[#0F172A] font-mono tracking-tight">
              {stat.value}
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <p className="text-xs font-medium text-[#64748B]">{stat.label}</p>
              <span className="text-[10px] text-[#CBD5E1]">·</span>
              <span className="text-[10px] text-[#94A3B8]">{stat.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
