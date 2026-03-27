import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'ImpactSwing | Charity Subscriptions',
  description: 'A modern golf charity subscription platform driven by impact and monthly prize draws. Turn your scores into giving.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <div className="container nav-container">
            <Link href="/" className="logo">
              <span className="text-gradient-emerald">Impact</span>Swing
            </Link>
            <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link href="/charities" className="nav-link">Charities</Link>
              <Link href="/how-it-works" className="nav-link">How it Works</Link>
              <Link href="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Log In</Link>
              <Link href="/subscribe" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Subscribe Now</Link>
            </nav>
          </div>
        </header>

        <main className="app-main">
          {children}
        </main>
        
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto', background: 'var(--bg-surface)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <p>&copy; {new Date().getFullYear()} ImpactSwing by Digital Heroes. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
