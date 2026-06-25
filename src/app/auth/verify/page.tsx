'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, KeyRound, Loader2, CheckCircle2, RefreshCw } from 'lucide-react';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Retrieve mobile from sessionStorage set by login page
  useEffect(() => {
    const stored = sessionStorage.getItem('auth_mobile');
    if (!stored) {
      router.replace('/auth/login');
      return;
    }
    setMobile(stored);
  }, [router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const otpValue = otp.join('');

  const handleOtpChange = (index: number, value: string) => {
    setError('');
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // Clear current cell
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move back
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (otpValue.length !== OTP_LENGTH) {
      setError('لطفاً کد ۶ رقمی را کامل وارد کنید.');
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
        setError(data.message ?? 'کد اشتباه است.');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        return;
      }

      setSuccess(true);
      sessionStorage.removeItem('auth_mobile');
      // Short success animation before redirect
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch {
      setError('خطای شبکه. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setCountdown(RESEND_COOLDOWN);
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute w-8 h-8 bg-[#10B981] rounded-lg opacity-20 animate-pulse" />
              <Zap className="w-4 h-4 text-[#10B981] relative z-10" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-widest uppercase select-none text-white">
              Artadex
            </span>
          </Link>
        </div>
      </header>

      {/* ── Form area ──────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#10B981]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm animate-fade-in">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-sm">

            {/* Success state */}
            {success ? (
              <div className="flex flex-col items-center py-8 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">ورود موفق!</h2>
                <p className="text-[#94A3B8] text-sm">در حال انتقال به داشبورد...</p>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
                  <KeyRound className="w-6 h-6 text-[#10B981]" strokeWidth={2} />
                </div>

                <h1 className="text-2xl font-extrabold text-white text-center mb-1">
                  تأیید شماره موبایل
                </h1>
                <p className="text-[#94A3B8] text-sm text-center mb-2">
                  کد ۶ رقمی ارسال شده به
                </p>
                <p className="text-[#10B981] text-sm font-mono font-semibold text-center tracking-widest mb-8">
                  {mobile}
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {/* OTP grid */}
                  <div
                    className="flex gap-2 justify-center mb-4"
                    dir="ltr"
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-digit-${i}`}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        disabled={loading}
                        aria-label={`رقم ${i + 1} از کد تأیید`}
                        className={[
                          'w-11 h-14 text-center text-xl font-bold font-mono rounded-xl border transition-all duration-150',
                          'bg-white/8 text-white placeholder-[#475569]',
                          'focus:outline-none focus:ring-2 focus:ring-[#10B981]/30',
                          digit
                            ? 'border-[#10B981] bg-[#10B981]/10 shadow-jade-glow'
                            : 'border-white/12',
                          'disabled:opacity-50',
                        ].join(' ')}
                      />
                    ))}
                  </div>

                  {/* Error */}
                  {error && (
                    <p role="alert" className="text-xs text-[#EF4444] text-center mb-4">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    id="verify-otp-btn"
                    type="submit"
                    disabled={loading || otpValue.length !== OTP_LENGTH}
                    className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        در حال تأیید...
                      </>
                    ) : (
                      'تأیید و ورود'
                    )}
                  </button>
                </form>

                {/* Resend */}
                <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-white/8">
                  <button
                    id="resend-otp-btn"
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#10B981] disabled:text-[#475569] disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {countdown > 0 ? `ارسال مجدد (${countdown}s)` : 'ارسال مجدد کد'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Back */}
          <p className="text-center text-[#475569] text-xs mt-6">
            <Link href="/auth/login" className="hover:text-[#94A3B8] transition-colors">
              ← تغییر شماره موبایل
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
