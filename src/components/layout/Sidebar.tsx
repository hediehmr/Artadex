'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Wallet,
  Settings,
  ChevronRight,
  Zap,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

export type NavId =
  | 'dashboard'
  | 'virtual-cards'
  | 'transactions'
  | 'top-up'
  | 'settings';

interface NavItem {
  id: NavId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'virtual-cards', label: 'Virtual Cards', icon: CreditCard, badge: '3' },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'top-up', label: 'Top-up Wallet', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeNav: NavId;
  onNavChange: (id: NavId) => void;
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Sidebar({
  activeNav,
  onNavChange,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* ── Mobile backdrop ─────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ───────────────────────────── */}
      <aside
        className={[
          'fixed top-0 left-0 z-40 h-full w-64 bg-[#0F172A] flex flex-col',
          'shadow-sidebar transition-transform duration-300 ease-out',
          'md:relative md:translate-x-0 md:z-auto md:flex-shrink-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {/* ── Brand ───────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/8 flex-shrink-0">
          {/* Jade hex icon */}
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute w-8 h-8 bg-[#10B981] rounded-lg opacity-20 animate-pulse" />
            <Zap className="w-4 h-4 text-[#10B981] relative z-10" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-lg tracking-widest uppercase select-none">
            Artadex
          </span>
          {/* Jade accent dot */}
          <span className="ml-auto w-2 h-2 rounded-full bg-[#10B981] animate-[pulseJade_2s_infinite]" />
        </div>

        {/* ── Navigation ──────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-[#475569] uppercase">
            Main Menu
          </p>

          {NAV_ITEMS.slice(0, 4).map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeNav === item.id}
              onClick={() => {
                onNavChange(item.id);
                onClose();
              }}
            />
          ))}

          <div className="my-3 border-t border-white/8" />
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-[#475569] uppercase">
            Account
          </p>

          {NAV_ITEMS.slice(4).map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeNav === item.id}
              onClick={() => {
                onNavChange(item.id);
                onClose();
              }}
            />
          ))}
        </nav>

        {/* ── User info strip ─────────────────────────── */}
        <div className="px-3 py-4 border-t border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin User</p>
              <p className="text-[#64748B] text-[10px] truncate">admin@artadex.io</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#475569] group-hover:text-white transition-colors flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}

// ── NavButton sub-component ───────────────────────────────────────────────────

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      id={`nav-${item.id}`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
    >
      <Icon className="w-4.5 h-4.5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && !isActive && (
        <span className="badge-jade">{item.badge}</span>
      )}
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A] opacity-60 flex-shrink-0" />
      )}
    </button>
  );
}
