import Link from 'next/link';
import { Zap, ShieldCheck, ArrowRight, CreditCard, Wallet, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0F172A]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute w-8 h-8 bg-[#10B981] rounded-lg opacity-20 animate-pulse" />
              <Zap className="w-4 h-4 text-[#10B981] relative z-10" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-widest uppercase select-none">
              Artadex
            </span>
          </div>

          {/* Auth buttons */}
          <nav className="flex items-center gap-3">
            <Link
              id="nav-login-btn"
              href="/auth/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-white transition-colors duration-150"
            >
              Login
            </Link>
            <Link
              id="nav-register-btn"
              href="/auth/login"
              className="btn-primary text-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          {/* Glow blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative animate-fade-in">
            <span className="badge-jade mb-6 inline-flex">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              P2P Crypto Exchange — Now in Beta
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-balance mb-6">
              Trade Crypto
              <span className="block text-[#10B981]">Without the Middleman.</span>
            </h1>

            <p className="max-w-xl mx-auto text-[#94A3B8] text-lg mb-10 text-balance">
              Artadex is a secure, peer-to-peer crypto exchange. Buy and sell USDT directly
              with other users — fast, transparent, and fee-efficient.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                id="hero-get-started-btn"
                href="/auth/login"
                className="btn-primary text-base px-6 py-3 shadow-jade-glow"
              >
                Start Trading
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                id="hero-login-btn"
                href="/auth/login"
                className="btn-secondary text-base px-6 py-3 border-white/12 text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Secure & Escrow-Protected',
                desc: 'Every trade is protected by smart-contract escrow. Your funds never leave until both parties confirm.',
              },
              {
                icon: CreditCard,
                title: 'Virtual Cards',
                desc: 'Instantly issue virtual USDT-backed cards for online payments worldwide.',
              },
              {
                icon: Globe,
                title: 'Global P2P Market',
                desc: 'Connect with thousands of verified traders across 50+ countries with competitive rates.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/8 hover:border-[#10B981]/40 hover:bg-white/8 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 flex items-center justify-center mb-4 group-hover:bg-[#10B981]/25 transition-colors">
                  <Icon className="w-5 h-5 text-[#10B981]" strokeWidth={2} />
                </div>
                <h2 className="text-base font-bold text-white mb-2">{title}</h2>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#10B981]/20 to-[#059669]/10 border border-[#10B981]/20 p-10 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMEI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6TTYgNHY2aDZWNEg2em0wIDMwdjZoNnYtNkg2em0yNCA2djZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
            <div className="relative">
              <Wallet className="w-10 h-10 text-[#10B981] mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
                Ready to get started?
              </h2>
              <p className="text-[#94A3B8] mb-6 max-w-sm mx-auto">
                Register in 30 seconds with just your mobile number. No email, no forms.
              </p>
              <Link
                id="cta-register-btn"
                href="/auth/login"
                className="btn-primary text-base px-8 py-3 inline-flex shadow-jade-glow"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-6 text-center text-[#475569] text-xs">
        © {new Date().getFullYear()} Artadex. All rights reserved.
      </footer>
    </div>
  );
}
