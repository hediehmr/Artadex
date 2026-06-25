'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Phone, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (!/^09[0-9]{9}$/.test(mobile)) {
      setError('شماره موبایل معتبر نیست. مثال: 09123456789');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? 'خطا در ارسال کد');
        return;
      }

      // Persist mobile for the verify page
      sessionStorage.setItem('auth_mobile', mobile);
      router.push('/auth/verify');
    } catch {
      setError('خطای شبکه. اتصال اینترنت خود را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="border-b border-white/8">
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
        </div>
      </header>

      {/* ── Form area ────────────────────────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Glow blob */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#10B981]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-sm animate-fade-in">
          {/* Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-6 h-6 text-[#10B981]" strokeWidth={2} />
            </div>

            <h1 className="text-2xl font-extrabold text-white text-center mb-1">
              ورود به آرتادکس
            </h1>
            <p className="text-[#94A3B8] text-sm text-center mb-8">
              شماره موبایل خود را وارد کنید تا کد تأیید ارسال شود.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Mobile input */}
              <div>
                <label
                  htmlFor="mobile-input"
                  className="block text-xs font-semibold text-[#94A3B8] mb-2 text-right"
                >
                  شماره موبایل
                </label>
                <div className="relative">
                  <input
                    id="mobile-input"
                    type="tel"
                    inputMode="numeric"
                    placeholder="09123456789"
                    value={mobile}
                    onChange={(e) => {
                      setError('');
                      setMobile(e.target.value.replace(/\D/g, '').slice(0, 11));
                    }}
                    disabled={loading}
                    dir="ltr"
                    className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3.5 text-white placeholder-[#475569] font-mono text-base tracking-widest focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all duration-150 disabled:opacity-50"
                    required
                    aria-describedby={error ? 'mobile-error' : undefined}
                  />
                </div>
                {error && (
                  <p
                    id="mobile-error"
                    role="alert"
                    className="mt-2 text-xs text-[#EF4444] text-right"
                  >
                    {error}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="send-otp-btn"
                type="submit"
                disabled={loading || mobile.length < 11}
                className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    ارسال کد تأیید
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/8">
              <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" strokeWidth={2} />
              <p className="text-[10px] text-[#475569]">
                اطلاعات شما رمزنگاری شده و کاملاً امن است.
              </p>
            </div>
          </div>

          {/* Back to home */}
          <p className="text-center text-[#475569] text-xs mt-6">
            <Link href="/" className="hover:text-[#94A3B8] transition-colors">
              ← بازگشت به صفحه اصلی
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
