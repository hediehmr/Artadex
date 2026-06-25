'use client';

import { useState } from 'react';
import Sidebar, { type NavId } from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';
import StatsStrip from '@/components/dashboard/StatsStrip';
import ActiveVirtualCards from '@/components/dashboard/ActiveVirtualCards';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

// ─── Page title map ───────────────────────────────────────────────────────────

const PAGE_TITLES: Record<NavId, string> = {
  dashboard: 'Dashboard',
  'virtual-cards': 'Virtual Cards',
  transactions: 'Transactions',
  'top-up': 'Top-up Wallet',
  settings: 'Settings',
};

// ─── Placeholder for non-dashboard pages ──────────────────────────────────────

function ComingSoon({ page }: { page: string }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center py-24 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[#ECFDF5] flex items-center justify-center">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-lg font-bold text-[#0F172A]">{page}</h2>
      <p className="text-sm text-[#94A3B8] max-w-xs">
        This section is under construction. The API-driven implementation is coming soon.
      </p>
      <span className="badge-jade text-xs">Roadmap Q3 2026</span>
    </div>
  );
}

// ─── Dashboard Page Content ───────────────────────────────────────────────────

function DashboardContent() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* ── Row 1: KPI stats ────────────────────────── */}
      <StatsStrip />

      {/* ── Row 2: Cards + Quick Actions ────────────── */}
      {/*
        Grid: 3 cols on lg+
          - Widget 1 spans 2 cols (Active Virtual Cards)
          - Widget 2 spans 1 col  (Quick Actions)
        On md: 2-col (cards take full width, quick actions below)
        On mobile: single column stacked
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="md:col-span-2 lg:col-span-2">
          <ActiveVirtualCards />
        </div>
        <div className="md:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* ── Row 3: Full-width activity table ────────── */}
      <div>
        <RecentActivity />
      </div>
    </div>
  );
}

// ─── App Shell (root component) ──────────────────────────────────────────────

export default function AppShell() {
  const [activeNav, setActiveNav] = useState<NavId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = PAGE_TITLES[activeNav];

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top header */}
        <TopHeader
          pageTitle={pageTitle}
          walletBalance="1,250.00"
          notificationCount={3}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
          aria-label={`${pageTitle} page content`}
        >
          {activeNav === 'dashboard' ? (
            <DashboardContent />
          ) : (
            <ComingSoon page={PAGE_TITLES[activeNav]} />
          )}
        </main>
      </div>
    </div>
  );
}
