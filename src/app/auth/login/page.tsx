'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Phone, ArrowRight, ArrowLeft, Loader2, ShieldCheck,
  ChevronDown, Check, Languages,
} from 'lucide-react';
import { i18n, type Lang } from '@/lib/authI18n';

// ─── Country data ─────────────────────────────────────────────────────────────

interface Country {
  dialCode: string;
  flag: string;
  nameEn: string;
  nameFa: string;
  /** Max digits in local number */
  maxLen: number;
  /** Placeholder digits (local part only) */
  placeholder: string;
}

const COUNTRIES: Country[] = [
  {
    dialCode: '+98',
    flag: '🇮🇷',
    nameEn: 'Iran',
    nameFa: 'ایران',
    maxLen: 11,   // accepts 09XXXXXXXXX (11) — leading 0 auto-stripped → 10 digits sent
    placeholder: '09123456789',
  },
  {
    dialCode: '+1',
    flag: '🇨🇦',
    nameEn: 'Canada',
    nameFa: 'کانادا',
    maxLen: 10,
    placeholder: '6045550123',
  },
];

// ─── Shared auth navbar ───────────────────────────────────────────────────────

function AuthNavbar({
  lang,
  onLangToggle,
  t,
}: {
  lang: Lang;
  onLangToggle: () => void;
  t: (typeof i18n)[Lang];
}) {
  return (
    <header className="border-b border-white/8 flex-shrink-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute w-8 h-8 bg-[#10B981] rounded-lg opacity-20 animate-pulse" />
            <Zap className="w-4 h-4 text-[#10B981] relative z-10" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-widest uppercase select-none text-white">
            Artadex
          </span>
        </Link>

        {/* Language toggle */}
        <button
          id="lang-toggle-btn"
          onClick={onLangToggle}
          aria-label="Toggle language"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/12 text-[#94A3B8] hover:text-white hover:border-white/20 transition-all duration-150 text-xs font-semibold"
        >
          <Languages className="w-3.5 h-3.5" />
          {lang === 'fa' ? 'EN' : 'فا'}
        </button>
      </div>
    </header>
  );
}

// ─── Country Dropdown ─────────────────────────────────────────────────────────

function CountryDropdown({
  selected,
  lang,
  onSelect,
  disabled,
}: {
  selected: Country;
  lang: Lang;
  onSelect: (c: Country) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        id="country-dropdown-btn"
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'flex items-center gap-2 h-[52px] px-3 rounded-xl border transition-all duration-150',
          'bg-white/8 border-white/12 text-white',
          open ? 'border-[#10B981] ring-2 ring-[#10B981]/20' : 'hover:border-white/20',
          'disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
        ].join(' ')}
      >
        <span className="text-xl leading-none">{selected.flag}</span>
        <span className="text-sm font-mono font-semibold text-[#10B981]">
          {selected.dialCode}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className={[
            'absolute z-50 mt-1.5 w-52 bg-[#1E293B] border border-white/12 rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden',
            lang === 'fa' ? 'right-0' : 'left-0',
          ].join(' ')}
        >
          {COUNTRIES.map((c) => {
            const isSelected = c.dialCode === selected.dialCode;
            return (
              <button
                key={c.dialCode}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => { onSelect(c); setOpen(false); }}
                className={[
                  'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-100',
                  isSelected
                    ? 'bg-[#10B981]/15 text-white'
                    : 'text-[#94A3B8] hover:bg-white/8 hover:text-white',
                ].join(' ')}
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <span className="flex-1 text-left font-medium">
                  {lang === 'fa' ? c.nameFa : c.nameEn}
                </span>
                <span className="font-mono text-xs text-[#10B981]">{c.dialCode}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('fa');
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [localNumber, setLocalNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = i18n[lang];
  const isRtl = lang === 'fa';

  // When country changes, reset number
  const handleCountrySelect = (c: Country) => {
    setCountry(c);
    setLocalNumber('');
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    let digits = localNumber.replace(/\D/g, '');
    // Auto-strip leading 0 (user typed 09... but +98 is already shown)
    if (digits.startsWith('0')) digits = digits.slice(1);
    // Iran needs exactly 10 local digits; Canada/US also 10
    const required = 10;
    if (digits.length < required) {
      setError(t.errInvalidMobile);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialCode: country.dialCode, localNumber: digits }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? t.errInvalidMobile);
        return;
      }

      // Pass all needed context to verify page
      sessionStorage.setItem('auth_mobile', data.fullMobile);
      sessionStorage.setItem('auth_lang', lang);
      sessionStorage.setItem('auth_display', `${country.flag} ${country.dialCode} ${digits}`);
      router.push('/auth/verify');
    } catch {
      setError(t.errNetwork);
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col" dir={t.dir}>
      <AuthNavbar lang={lang} onLangToggle={() => setLang(l => l === 'fa' ? 'en' : 'fa')} t={t} />

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#10B981]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#3B82F6]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm animate-fade-in">
          {/* Glass card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-md">

            {/* Icon badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-6 shadow-jade-glow">
              <Phone className="w-7 h-7 text-[#10B981]" strokeWidth={1.75} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-extrabold text-white text-center mb-1.5 tracking-tight">
              {t.loginTitle}
            </h1>
            <p className="text-[#64748B] text-sm text-center mb-8 leading-relaxed">
              {t.loginSubtitle}
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Country selector */}
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-2">
                  {t.labelCountry}
                </label>
                <CountryDropdown
                  selected={country}
                  lang={lang}
                  onSelect={handleCountrySelect}
                  disabled={loading}
                />
              </div>

              {/* Mobile number */}
              <div>
                <label
                  htmlFor="mobile-input"
                  className="block text-xs font-semibold text-[#64748B] mb-2"
                >
                  {t.labelMobile}
                </label>

                {/* Input row — flag+code prefix + number field */}
                <div className="flex gap-2">
                  {/* Dial code badge (read-only display) */}
                  <div className="flex items-center gap-1.5 h-[52px] px-3 rounded-xl bg-white/5 border border-white/10 text-[#10B981] font-mono text-sm font-semibold flex-shrink-0 select-none">
                    <span className="text-base leading-none">{country.flag}</span>
                    <span>{country.dialCode}</span>
                  </div>

                  {/* Number field */}
                  <input
                    id="mobile-input"
                    type="tel"
                    inputMode="numeric"
                    placeholder={country.placeholder}
                    value={localNumber}
                    onChange={(e) => {
                      setError('');
                      let raw = e.target.value.replace(/\D/g, '');
                      // Auto-strip leading 0: user types 09... but +98 is already shown
                      if (raw.startsWith('0')) raw = raw.slice(1);
                      setLocalNumber(raw.slice(0, country.maxLen));
                    }}
                    disabled={loading}
                    dir="ltr"
                    maxLength={country.maxLen}
                    className={[
                      'flex-1 h-[52px] bg-white/8 border rounded-xl px-4 text-white',
                      'placeholder-[#334155] font-mono text-base tracking-widest',
                      'focus:outline-none focus:ring-2 focus:ring-[#10B981]/25 transition-all duration-150',
                      'disabled:opacity-50',
                      error ? 'border-[#EF4444]/60' : 'border-white/12 focus:border-[#10B981]',
                    ].join(' ')}
                    required
                    aria-describedby={error ? 'mobile-error' : undefined}
                  />
                </div>

                {/* Progress bar under input */}
                {localNumber.length > 0 && (
                  <div className="mt-2 h-0.5 w-full bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                      style={{ width: `${(localNumber.length / country.maxLen) * 100}%` }}
                    />
                  </div>
                )}

                {/* Formatted number preview */}
                {localNumber.length > 0 && !error && (
                  <p className="mt-1.5 text-[11px] text-[#475569] font-mono" dir="ltr">
                    {country.dialCode} {localNumber}
                  </p>
                )}

                {error && (
                  <p id="mobile-error" role="alert" className="mt-2 text-xs text-[#EF4444]">
                    {error}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="send-otp-btn"
                type="submit"
                disabled={loading || (() => { const d = localNumber.replace(/\D/g, ''); return (d.startsWith('0') ? d.slice(1) : d).length < 10; })()}
                className="w-full btn-primary h-[52px] text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    {t.sendCode}
                    <ArrowIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className={`flex items-center gap-2 mt-6 pt-6 border-t border-white/8 ${isRtl ? 'flex-row' : 'flex-row'}`}>
              <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" strokeWidth={2} />
              <p className="text-[10px] text-[#475569] leading-relaxed">{t.securityNote}</p>
            </div>
          </div>

          {/* Back link */}
          <p className="text-center text-[#475569] text-xs mt-5">
            <Link href="/" className="hover:text-[#94A3B8] transition-colors inline-flex items-center gap-1">
              {t.backHome}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
