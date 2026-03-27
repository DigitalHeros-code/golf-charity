'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { CheckCircle2, CreditCard, Heart } from 'lucide-react';

export default function Subscribe() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [charityList, setCharityList] = useState<any[]>([]);
  
  // Form State
  const [plan, setPlan] = useState('monthly');
  const [charityId, setCharityId] = useState('');
  const [percentage, setPercentage] = useState(10);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Payment State (Mock)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchCharities = async () => {
      const { data } = await supabase.from('charities').select('*');
      if (data) setCharityList(data);
    };
    fetchCharities();
  }, [supabase]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      alert(signUpError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 2. Mock payment processing (PRD asks for gateway like Stripe but allows mock for demo)
      // This would normally be handled by a webhook, but for this PRD flow:
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_tier: plan,
          selected_charity_id: charityId,
          charity_percentage: percentage,
          subscription_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }
      
      router.push('/dashboard');
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <div className="glass-panel animate-fade-up">
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Join the Impact</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Subscribe to participate in monthly draws and support incredible causes.
        </p>

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ 
              flex: 1, 
              height: '4px', 
              background: s <= step ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
              borderRadius: '2px',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="animate-fade-up">
            <h3>1. Select Your Plan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div 
                onClick={() => setPlan('monthly')}
                style={{
                  border: `2px solid ${plan === 'monthly' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  padding: '1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: plan === 'monthly' ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Monthly</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>$19<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}><CheckCircle2 size={16} className="text-gradient-emerald" /> Enter monthly draws</li>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}><CheckCircle2 size={16} className="text-gradient-emerald" /> Automatic charity giving</li>
                </ul>
              </div>
              <div 
                onClick={() => setPlan('yearly')}
                style={{
                  border: `2px solid ${plan === 'yearly' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  padding: '1.5rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: plan === 'yearly' ? 'rgba(16, 185, 129, 0.05)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Yearly</div>
                  <div style={{ fontSize: '0.75rem', background: 'var(--accent-secondary)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontWeight: 700 }}>SAVE 20%</div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>$180<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/yr</span></div>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}><CheckCircle2 size={16} className="text-gradient-emerald" /> All Monthly benefits</li>
                  <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}><CheckCircle2 size={16} className="text-gradient-emerald" /> 2 Months Free</li>
                </ul>
              </div>
            </div>

            <h3>Account Details</h3>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Your email address" />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a password" minLength={6} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Continue to Charity Selection</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="animate-fade-up">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Heart className="text-gradient-emerald" /> Choose Your Impact</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We transparently route a minimum of 10% of your fee to the charity of your choice.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {charityList.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => setCharityId(c.id)}
                  style={{
                    padding: '1rem',
                    border: `1px solid ${charityId === c.id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: charityId === c.id ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ display: 'block' }}>{c.name}</strong>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.description}</span>
                  </div>
                  {charityId === c.id && <CheckCircle2 color="var(--accent-primary)" />}
                </div>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Contribution Percentage</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{percentage}%</span>
              </label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={percentage} 
                onChange={e => setPercentage(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                You can increase your donation percentage at any time. Minimum is 10%.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={!charityId}>Payment Details</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubscribe} className="animate-fade-up">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard className="text-gradient-emerald" /> Secure Checkout</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Total today: <strong style={{ color: '#fff', fontSize: '1.25rem' }}>${plan === 'monthly' ? '19.00' : '180.00'}</strong>
            </p>

            <div className="form-group">
              <label className="form-label">Name on Card</label>
              <input type="text" className="form-control" value={cardName} onChange={e => setCardName(e.target.value)} required placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label className="form-label">Card Information (Mock)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-control" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required placeholder="0000 0000 0000 0000" style={{ flex: 3 }} />
                <input type="text" className="form-control" required placeholder="MM/YY" style={{ flex: 1 }} />
                <input type="text" className="form-control" required placeholder="CVC" style={{ flex: 1 }} />
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <strong>Note:</strong> This is a sample assignment. No real charges will be made. Just fill in any mock details to complete the flow.
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Processing...' : `Subscribe & Pay $${plan === 'monthly' ? '19' : '180'}`}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
