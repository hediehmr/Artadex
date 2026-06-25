'use client';

import { Bell, Menu, TrendingUp } from 'lucide-react';

// ─── Props ───────────────────────────────────────────────────────────────────

interface TopHeaderProps {
  pageTitle: string;
  walletBalance: string;
  notificationCount?: number;
  onMenuToggle: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function TopHeader({
  pageTitle,
  walletBalance,
  notificationCount = 0,
  onMenuToggle,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
      {/* ── Hamburger (mobile only) ──────────────────── */}
      <button
        id="mobile-menu-toggle"
        onClick={onMenuToggle}
        aria-label="Open navigation menu"
        className="icon-btn md:hidden"
      >
        <Menu className="w-4.5 h-4.5" />
      </button>

      {/* ── Page title ──────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base md:text-lg font-bold text-[#0F172A] truncate">
          {pageTitle}
        </h1>
        <p className="hidden sm:block text-xs text-[#94A3B8] mt-0.5">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* ── Right cluster ───────────────────────────── */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {/* Wallet balance pill */}
        <div
          id="wallet-balance-display"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]"
        >
          <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" strokeWidth={2.5} />
          <span className="text-[#059669] text-xs font-bold font-mono tracking-tight">
            {walletBalance}
          </span>
          <span className="text-[#6EE7B7] text-[10px] font-semibold">USDT</span>
        </div>

        {/* Notification bell */}
        <button
          id="notifications-btn"
          aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
          className="icon-btn"
        >
          <Bell className="w-4.5 h-4.5" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User avatar */}
        <button
          id="user-avatar-btn"
          aria-label="Open account menu"
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-xs font-bold hover:opacity-90 hover:shadow-jade-glow transition-all duration-150 cursor-pointer flex-shrink-0"
        >
          AD
        </button>
      </div>
    </header>
  );
}
