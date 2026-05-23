import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { LiveTicker } from '@/components/layout/live-ticker';
import { BetSlipDrawer } from '@/components/betting/bet-slip-drawer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const metadata: Metadata = {
  title: 'SportStrike — Live Betting, Fantasy & Predictions',
  description: 'Premium real-time sports betting, IPL fantasy contests, and prediction markets',
  keywords: ['IPL betting', 'fantasy cricket', 'prediction markets', 'live odds'],
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-mesh antialiased`}>
        <Providers>
          <LiveTicker />
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-8 pt-16">{children}</main>
          <MobileNav />
          <BetSlipDrawer />
        </Providers>
      </body>
    </html>
  );
}