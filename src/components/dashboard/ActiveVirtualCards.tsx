'use client';

import {
  Wifi,
  MoreHorizontal,
  Snowflake,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VirtualCard {
  id: string;
  nickname: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'terminated';
  network: 'Visa' | 'Mastercard';
  color: 'jade' | 'navy' | 'slate';
}

// ─── Gradient map ────────────────────────────────────────────────────────────

const CARD_GRADIENTS: Record<VirtualCard['color'], string> = {
  jade: 'from-[#064E3B] via-[#065F46] to-[#10B981]',
  navy: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
  slate: 'from-[#1E3A5F] via-[#1e40af] to-[#3B82F6]',
};

// ─── Sample data ─────────────────────────────────────────────────────────────

const SAMPLE_CARDS: VirtualCard[] = [
  {
    id: 'vcc-001',
    nickname: 'Shopping Card',
    lastFour: '4829',
    expiryMonth: '09',
    expiryYear: '27',
    balance: 350.0,
    currency: 'USDT',
    status: 'active',
    network: 'Visa',
    color: 'jade',
  },
  {
    id: 'vcc-002',
    nickname: 'Subscriptions',
    lastFour: '7731',
    expiryMonth: '03',
    expiryYear: '26',
    balance: 120.5,
    currency: 'USDT',
    status: 'active',
    network: 'Mastercard',
    color: 'navy',
  },
  {
    id: 'vcc-003',
    nickname: 'Travel Expenses',
    lastFour: '2204',
    expiryMonth: '11',
    expiryYear: '25',
    balance: 0,
    currency: 'USDT',
    status: 'frozen',
    network: 'Visa',
    color: 'slate',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ActiveVirtualCards() {
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Active Virtual Cards</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            {SAMPLE_CARDS.filter((c) => c.status === 'active').length} of{' '}
            {SAMPLE_CARDS.length} cards active
          </p>
        </div>
        <button id="manage-cards-btn" className="btn-secondary text-xs py-1.5 px-3">
          Manage All
        </button>
      </div>

      {/* Card Scroll Strip */}
      <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar -mx-1 px-1">
        {SAMPLE_CARDS.map((card) => (
          <CreditCardTile
            key={card.id}
            card={card}
            isRevealed={revealedCardId === card.id}
            onToggleReveal={() => toggleReveal(card.id)}
          />
        ))}
      </div>

      {/* Summary bar */}
      <div className="mt-5 pt-4 border-t border-[#F1F5F9] grid grid-cols-3 divide-x divide-[#F1F5F9] text-center">
        <StatItem label="Total Balance" value="$470.50" color="jade" />
        <StatItem label="Transactions" value="124" />
        <StatItem label="Frozen Cards" value="1" color="yellow" />
      </div>
    </div>
  );
}

// ─── CreditCardTile ───────────────────────────────────────────────────────────

function CreditCardTile({
  card,
  isRevealed,
  onToggleReveal,
}: {
  card: VirtualCard;
  isRevealed: boolean;
  onToggleReveal: () => void;
}) {
  const gradient = CARD_GRADIENTS[card.color];
  const isFrozen = card.status === 'frozen';

  return (
    <div
      id={`card-tile-${card.id}`}
      className={[
        'relative flex-shrink-0 w-64 h-40 rounded-2xl p-5 overflow-hidden',
        `bg-gradient-to-br ${gradient}`,
        'shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl',
        isFrozen ? 'opacity-70 grayscale-[30%]' : '',
      ].join(' ')}
      style={{ perspective: '800px' }}
    >
      {/* Frozen overlay */}
      {isFrozen && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-[1px] rounded-2xl z-10">
          <div className="flex flex-col items-center gap-1">
            <Snowflake className="w-6 h-6 text-blue-300" />
            <span className="text-white text-xs font-semibold tracking-wide">FROZEN</span>
          </div>
        </div>
      )}

      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -left-4 w-32 h-32 rounded-full bg-white/5" />

      {/* Top row */}
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-white/60 text-[10px] font-medium tracking-widest uppercase">
            {card.network}
          </p>
          <p className="text-white text-sm font-semibold mt-0.5 truncate max-w-[110px]">
            {card.nickname}
          </p>
        </div>
        <Wifi className="w-5 h-5 text-white/70 rotate-90" />
      </div>

      {/* Card number */}
      <div className="relative z-10 mt-3">
        <p className="text-white/90 text-xs font-mono tracking-[0.2em]">
          •••• •••• ••••{' '}
          <span className={isRevealed ? 'text-[#10B981]' : ''}>
            {card.lastFour}
          </span>
        </p>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex justify-between items-end mt-auto pt-4">
        <div>
          <p className="text-white/50 text-[9px] uppercase tracking-widest">Expires</p>
          <p className="text-white text-xs font-mono font-semibold">
            {card.expiryMonth}/{card.expiryYear}
          </p>
        </div>

        <div className="text-right">
          <p className="text-white/50 text-[9px] uppercase tracking-widest">Balance</p>
          <p className="text-[#10B981] text-sm font-bold font-mono">
            ${card.balance.toFixed(2)}
          </p>
        </div>

        {/* Reveal toggle */}
        <button
          aria-label={isRevealed ? 'Hide card details' : 'Reveal card details'}
          onClick={onToggleReveal}
          className="absolute bottom-3 right-3 w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
        >
          {isRevealed ? (
            <EyeOff className="w-3.5 h-3.5 text-white" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}

// ─── StatItem ─────────────────────────────────────────────────────────────────

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: 'jade' | 'yellow' | 'red';
}) {
  const valueColor = {
    jade: 'text-[#10B981]',
    yellow: 'text-[#F59E0B]',
    red: 'text-[#EF4444]',
    undefined: 'text-[#0F172A]',
  }[color as string] ?? 'text-[#0F172A]';

  return (
    <div className="px-2">
      <p className={`text-sm font-bold ${valueColor}`}>{value}</p>
      <p className="text-[10px] text-[#94A3B8] mt-0.5">{label}</p>
    </div>
  );
}
