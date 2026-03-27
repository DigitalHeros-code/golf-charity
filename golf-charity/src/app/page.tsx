'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Heart, Trophy, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const containerVariants: import('framer-motion').Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants: import('framer-motion').Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="home-wrapper">
      <style dangerouslySetInnerHTML={{__html: `
        .hero-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 4rem 1.5rem;
        }
        
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          z-index: 2;
        }

        .hero-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%);
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(3rem, 5vw, 4.5rem);
          margin-bottom: 1.5rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 5rem;
        }

        .feature-card {
          padding: 2rem;
          border-radius: var(--radius-lg);
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--glass-border);
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .icon-emerald { background: rgba(16, 185, 129, 0.1); color: var(--accent-primary); }
        .icon-amber { background: rgba(245, 158, 11, 0.1); color: var(--accent-secondary); }
        .icon-slate { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }

        .cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
      `}} />

      <section className="hero-section">
        <div className="hero-bg" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="badge" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-primary)',
              borderRadius: '2rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              marginBottom: '2rem',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              Join 10,000+ Making an Impact
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="hero-title">
              Your Scores. <br />
              <span className="text-gradient-emerald">Meaningful Impact.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="hero-subtitle">
              Transform your performance into purpose. A modern subscription platform where your last 5 scores enter you into monthly prize draws—while supporting the charities you care about.
            </motion.p>
            
            <motion.div variants={itemVariants} className="cta-group">
              <Link href="/subscribe" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Start Making an Impact <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Link>
              <Link href="/how-it-works" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="feature-card">
              <div className="feature-icon icon-emerald"><Heart /></div>
              <h3>Choose Your Cause</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Allocate a portion of your subscription to a verified charity. Track your lifetime impact easily.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="feature-card">
              <div className="feature-icon icon-slate"><Target /></div>
              <h3>Log 5 Scores</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Just enter your most recent matches in Stableford format (1-45). Your latest 5 scores act as your continuous draw entry.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="feature-card">
              <div className="feature-icon icon-amber"><Trophy /></div>
              <h3>Monthly Prize Draws</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Every month, 5 numbers are drawn algorithmically. Match 3, 4, or 5 to win a share of the rolling jackpot.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
