import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artadex — Virtual Credit Card Platform',
  description:
    'Artadex is a secure, API-driven virtual credit card platform. Manage your virtual cards, wallet balance, and transactions in real time.',
  keywords: ['virtual credit card', 'VCC', 'USDT', 'fintech', 'Artadex'],
  authors: [{ name: 'Artadex' }],
  robots: 'noindex, nofollow', // private dashboard — not for search engines
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased">{children}</body>
    </html>
  );
}
