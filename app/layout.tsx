import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VENUS CODE — Decode the Vibe',
  description: 'A mystical relationship reflection experience inspired by astrology and numerology.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
