'use client';

import {
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Globe,
  Gamepad2,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Download,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type TxStatus = 'completed' | 'pending' | 'failed';
type TxType = 'debit' | 'credit';

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  icon: React.ElementType;
  iconBg: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  type: TxType;
  status: TxStatus;
  cardLast4: string;
}

// ─── Sample data ─────────────────────────────────────────────────────────────

const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    merchant: 'Amazon.com',
    category: 'Shopping',
    icon: ShoppingCart,
    iconBg: '#FFF7ED',
    date: 'Jun 12, 2026',
    time: '14:23',
    amount: 89.99,
    currency: 'USDT',
    type: 'debit',
    status: 'completed',
    cardLast4: '4829',
  },
  {
    id: 'tx-002',
    merchant: 'Wallet Top-Up',
    category: 'Deposit',
    icon: ArrowDownLeft,
    iconBg: '#ECFDF5',
    date: 'Jun 12, 2026',
    time: '11:05',
    amount: 500.0,
    currency: 'USDT',
    type: 'credit',
    status: 'completed',
    cardLast4: '—',
  },
  {
    id: 'tx-003',
    merchant: 'Netflix',
    category: 'Subscription',
    icon: Globe,
    iconBg: '#FEF2F2',
    date: 'Jun 11, 2026',
    time: '09:00',
    amount: 15.99,
    currency: 'USDT',
    type: 'debit',
    status: 'completed',
    cardLast4: '7731',
  },
  {
    id: 'tx-004',
    merchant: 'Steam Store',
    category: 'Gaming',
    icon: Gamepad2,
    iconBg: '#EFF6FF',
    date: 'Jun 11, 2026',
    time: '20:44',
    amount: 59.99,
    currency: 'USDT',
    type: 'debit',
    status: 'pending',
    cardLast4: '4829',
  },
  {
    id: 'tx-005',
    merchant: 'Booking.com',
    category: 'Travel',
    icon: Globe,
    iconBg: '#F5F3FF',
    date: 'Jun 10, 2026',
    time: '16:30',
    amount: 220.0,
    currency: 'USDT',
    type: 'debit',
    status: 'failed',
    cardLast4: '2204',
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TxStatus, { label: string; cls: string }> = {
  completed: { label: 'Completed', cls: 'badge-jade' },
  pending: { label: 'Pending', cls: 'badge-yellow' },
  failed: { label: 'Failed', cls: 'badge-red' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function RecentActivity() {
  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-[#0F172A]">Recent Activity</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Last 30 days · All cards</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] w-40">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" />
            <input
              id="tx-search"
              type="search"
              placeholder="Search…"
              aria-label="Search transactions"
              className="text-xs text-[#0F172A] bg-transparent outline-none w-full placeholder:text-[#CBD5E1]"
            />
          </div>

          <button id="tx-filter-btn" className="icon-btn" aria-label="Filter transactions">
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button id="tx-export-btn" className="icon-btn" aria-label="Export transactions">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#F1F5F9]">
        <table className="w-full text-sm" aria-label="Recent transactions table">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#F1F5F9]">
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase w-8">#</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">Merchant</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">Date</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">Card</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">Status</th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">Amount</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F8FAFC]">
            {TRANSACTIONS.map((tx, idx) => {
              const Icon = tx.icon;
              const { label, cls } = STATUS_CONFIG[tx.status];
              const isCredit = tx.type === 'credit';

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-[#F8FAFC] transition-colors duration-100 group"
                >
                  <td className="px-4 py-3.5 text-[#CBD5E1] text-xs font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: tx.iconBg }}
                      >
                        <Icon className="w-4 h-4 text-[#475569]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#0F172A]">{tx.merchant}</p>
                        <p className="text-[10px] text-[#94A3B8]">{tx.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-[#0F172A]">{tx.date}</p>
                    <p className="text-[10px] text-[#94A3B8]">{tx.time}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono text-[#64748B]">
                    {tx.cardLast4 !== '—' ? `••${tx.cardLast4}` : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cls}>{label}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isCredit ? (
                        <ArrowDownLeft className="w-3 h-3 text-[#10B981]" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-[#EF4444]" />
                      )}
                      <span
                        className={`text-xs font-bold font-mono ${
                          isCredit ? 'text-[#10B981]' : 'text-[#0F172A]'
                        }`}
                      >
                        {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] text-right">{tx.currency}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      aria-label={`More options for ${tx.merchant} transaction`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#CBD5E1] hover:text-[#64748B] hover:bg-[#F1F5F9] opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card list — mobile */}
      <div className="md:hidden space-y-3">
        {TRANSACTIONS.map((tx) => {
          const Icon = tx.icon;
          const { label, cls } = STATUS_CONFIG[tx.status];
          const isCredit = tx.type === 'credit';

          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: tx.iconBg }}
              >
                <Icon className="w-4 h-4 text-[#475569]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0F172A] truncate">{tx.merchant}</p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">
                  {tx.date} · {tx.time}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-xs font-bold font-mono ${
                    isCredit ? 'text-[#10B981]' : 'text-[#0F172A]'
                  }`}
                >
                  {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                </p>
                <span className={`${cls} mt-1`}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
        <p className="text-[11px] text-[#94A3B8]">
          Showing 5 of 124 transactions
        </p>
        <button id="view-all-transactions-btn" className="text-[11px] text-[#10B981] font-semibold hover:underline">
          View all transactions →
        </button>
      </div>
    </div>
  );
}
