import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AIBot',
  description: 'Institutional crypto analytics terminal for BTC and ETH',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
