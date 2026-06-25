'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, KeyRound, Loader2, CheckCircle2, RefreshCw, Languages,
} from 'lucide-react';
import { i18n, type Lang } from '@/lib/authI18n';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('fa');
  const [mobile, setMobile] = useState('');
  const [displayMobile, setDisplayMobile] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Restore session data
  useEffect(() => {
    const storedMobile = sessionStorage.getItem('auth_mobile');
    const storedLang = sessionStorage.getItem('auth_lang') as Lang | null;
    const storedDisplay = sessionStorage.getItem('auth_display');

    if (!storedMobile) {
      router.replace('/auth/login');
      return;
    }
    setMobile(storedMobile);
    if (storedLang) setLang(storedLang);
    if (storedDisplay) setDisplayMobile(storedDisplay);
  }, [router]);

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first cell
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const t = i18n[lang];
  const otpValue = otp.join('');

  const handleOtpChange = (index: number, value: string) => {
    setError('');
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const next = [...otp];
        next[index] = '';
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft') {
      const target = lang === 'fa' ? index + 1 : index - 1;
      if (target >= 0 && target < OTP_LENGTH) inputRefs.current[target]?.focus();
    }
    if (e.key === 'ArrowRight') {
      const target = lang === 'fa' ? index - 1 : index + 1;
      if (target >= 0 && target < OTP_LENGTH) inputRefs.current[target]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== OTP_LENGTH) {
      setError(t.errIncomplete);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: otpValue }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? t.errWrongOtp);
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        return;
      }

      setSuccess(true);
      sessionStorage.removeItem('auth_mobile');
      sessionStorage.removeItem('auth_lang');
      sessionStorage.removeItem('auth_display');
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch {
      setError(t.errNetworkVerify);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setCountdown(RESEND_COOLDOWN);
    // Extract dial code and local number from stored full mobile
    const match = mobile.match(/^(\+\d+)(\d+)$/);
    if (match) {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dialCode: match[1], localNumber: match[2] }),
      });
    }
    inputRefs.current[0]?.focus();
  };

  // OTP cells: always LTR (digits), but rendered RTL or LTR
  const cells = lang === 'fa' ? [...Array(OTP_LENGTH).keys()].reverse() : [...Array(OTP_LENGTH).keys()];

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col" dir={t.dir}>
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/8 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
            onClick={() => setLang(l => l === 'fa' ? 'en' : 'fa')}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 border border-white/12 text-[#94A3B8] hover:text-white hover:border-white/20 transition-all duration-150 text-xs font-semibold"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === 'fa' ? 'EN' : 'فا'}
          </button>
        </div>
      </header>

      {/* ── Form area ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#10B981]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#3B82F6]/4 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm animate-fade-in">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-md">

            {/* ── Success State ────────────────────────────────────── */}
            {success ? (
              <div className="flex flex-col items-center py-8 animate-fade-in">
                <div className="w-20 h-20 rounded-3xl bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center mb-5 shadow-jade-glow">
                  <CheckCircle2 className="w-10 h-10 text-[#10B981]" strokeWidth={1.75} />
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2">{t.successTitle}</h2>
                <p className="text-[#64748B] text-sm">{t.successSub}</p>
                {/* Loading dots */}
                <div className="flex gap-1.5 mt-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[#10B981] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Icon badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-6 shadow-jade-glow">
                  <KeyRound className="w-7 h-7 text-[#10B981]" strokeWidth={1.75} />
                </div>

                <h1 className="text-2xl font-extrabold text-white text-center mb-1.5 tracking-tight">
                  {t.verifyTitle}
                </h1>
                <p className="text-[#64748B] text-sm text-center mb-1">
                  {t.verifySubtitle}
                </p>
                <p className="text-[#10B981] text-sm font-mono font-semibold text-center tracking-widest mb-8 break-all">
                  {displayMobile || mobile}
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {/* OTP cells — always LTR regardless of page dir */}
                  <div
                    className="flex gap-2 justify-center mb-4"
                    dir="ltr"
                    onPaste={handlePaste}
                  >
                    {Array.from({ length: OTP_LENGTH }, (_, i) => (
                      <div key={i} className="relative">
                        <input
                          id={`otp-digit-${i}`}
                          ref={(el) => { inputRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={otp[i]}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          disabled={loading}
                          aria-label={t.digitLabel(i)}
                          className={[
                            'w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border',
                            'transition-all duration-150 bg-white/8 text-white',
                            'focus:outline-none focus:ring-2 focus:ring-[#10B981]/30',
                            otp[i]
                              ? 'border-[#10B981] bg-[#10B981]/10 shadow-jade-glow scale-105'
                              : 'border-white/12 hover:border-white/20',
                            'disabled:opacity-50',
                          ].join(' ')}
                        />
                        {/* Filled dot indicator */}
                        {otp[i] && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#10B981]" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <p role="alert" className="text-xs text-[#EF4444] text-center mb-4 animate-fade-in">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    id="verify-otp-btn"
                    type="submit"
                    disabled={loading || otpValue.length !== OTP_LENGTH}
                    className="w-full btn-primary h-[52px] text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.verifying}
                      </>
                    ) : (
                      t.verifyBtn
                    )}
                  </button>
                </form>

                {/* Resend */}
                <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-white/8">
                  <button
                    id="resend-otp-btn"
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#10B981] disabled:text-[#334155] disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${countdown > 0 ? '' : 'text-[#10B981]'}`}
                    />
                    {countdown > 0 ? t.resendCooldown(countdown) : t.resend}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Back link */}
          <p className="text-center text-[#475569] text-xs mt-5">
            <Link href="/auth/login" className="hover:text-[#94A3B8] transition-colors">
              {t.backToLogin}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
