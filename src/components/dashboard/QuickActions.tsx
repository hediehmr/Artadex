'use client';

import {
  Plus,
  Snowflake,
  Trash2,
  Send,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  variant: 'primary' | 'secondary' | 'danger' | 'warning';
  shortcut?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'create-card',
    label: 'Create New Card',
    description: 'Issue a virtual card instantly',
    icon: Plus,
    variant: 'primary',
    shortcut: '⌘N',
  },
  {
    id: 'freeze-card',
    label: 'Freeze Card',
    description: 'Temporarily disable a card',
    icon: Snowflake,
    variant: 'secondary',
    shortcut: '⌘F',
  },
  {
    id: 'transfer-funds',
    label: 'Transfer Funds',
    description: 'Move balance between cards',
    icon: Send,
    variant: 'secondary',
  },
  {
    id: 'reload-balance',
    label: 'Reload Balance',
    description: 'Top up a card from wallet',
    icon: RefreshCw,
    variant: 'secondary',
  },
  {
    id: 'terminate-card',
    label: 'Terminate Card',
    description: 'Permanently delete a card',
    icon: Trash2,
    variant: 'danger',
  },
];

// ─── Variant styling ─────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<QuickAction['variant'], string> = {
  primary:
    'bg-[#10B981] border-[#059669] text-white hover:bg-[#059669] hover:shadow-jade-glow',
  secondary:
    'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-[#CBD5E1] hover:shadow-sm',
  danger:
    'bg-[#FEF2F2] border-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444]',
  warning:
    'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706] hover:bg-[#F59E0B] hover:text-white',
};

const ICON_STYLES: Record<QuickAction['variant'], string> = {
  primary: 'bg-white/20 text-white',
  secondary: 'bg-[#F1F5F9] text-[#64748B]',
  danger: 'bg-[#FEE2E2] text-[#EF4444]',
  warning: 'bg-[#FEF3C7] text-[#F59E0B]',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuickActions() {
  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-base font-bold text-[#0F172A]">Quick Actions</h2>
        <p className="text-xs text-[#94A3B8] mt-0.5">Manage your virtual cards</p>
      </div>

      {/* Actions list */}
      <div className="space-y-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              id={`action-${action.id}`}
              aria-label={action.label}
              className={[
                'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border',
                'transition-all duration-150 active:scale-[0.98] text-left group',
                VARIANT_STYLES[action.variant],
              ].join(' ')}
            >
              {/* Icon container */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ICON_STYLES[action.variant]}`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
              </div>

              {/* Labels */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-none">{action.label}</p>
                <p className="text-[10px] opacity-60 mt-1 leading-none">
                  {action.description}
                </p>
              </div>

              {/* Shortcut or chevron */}
              {action.shortcut ? (
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono border border-current opacity-40">
                  {action.shortcut}
                </kbd>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* API status indicator */}
      <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-[pulseJade_2s_infinite]" />
        <span className="text-[10px] text-[#94A3B8] font-medium">
          API Status: <span className="text-[#10B981] font-semibold">Operational</span>
        </span>
        <span className="ml-auto text-[10px] text-[#CBD5E1]">99.9% uptime</span>
      </div>
    </div>
  );
}
