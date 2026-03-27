'use client';

import React from 'react';
import { Target, Trophy, Heart, ArrowDown, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="container animate-fade-up" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>How It <span className="text-gradient-emerald">Works</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem' }}>
          Three simple steps to transform your scorecards into meaningful impact and rewards.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
        
        {/* Step 1 */}
        <div className="glass-panel" style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          <div style={{ flexShrink: 0, width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
            1
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Heart className="text-gradient-emerald" size={24} /> Subscribe & Select Charity</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Sign up for a monthly or yearly plan. You decide which vetted charity receives your contribution (minimum 10%). A portion of the remainder funds the monthly prize pool.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-panel" style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          <div style={{ flexShrink: 0, width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
            2
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Target color="#38bdf8" size={24} /> Log Your Last 5 Scores</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You don't need a formal handicap. Just enter your Stableford scores (1-45). The platform automatically retains only your latest 5 scores—these act as your rolling "lottery ticket" for every draw.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-panel" style={{ display: 'flex', gap: '2rem', alignItems: 'center', position: 'relative' }}>
          <div style={{ flexShrink: 0, width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
            3
          </div>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><Trophy color="var(--accent-secondary)" size={24} /> The Monthly Draw</h3>
            <p style={{ color: 'var(--text-secondary)' }}>On the 1st of every month, our engine algorithmically selects 5 numbers. If your 5 stored scores match 3, 4, or 5 numbers (in any order), you win a share of that tier's prize pool!</p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Ready to Swing for Impact?</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/subscribe" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Start Now <ArrowRight size={20} />
          </Link>
          <Link href="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            User Login <LogIn size={20} />
          </Link>
        </div>
      </div>

    </div>
  );
}
