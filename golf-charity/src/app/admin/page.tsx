'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Users, Target, Heart, Trophy, BarChart3, LogOut, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Real data states
  const [users, setUsers] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [winners, setWinners] = useState<any[]>([]);
  const [drawResult, setDrawResult] = useState<number[] | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      
      // Fetch data for all modules
      const { data: usersData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: charitiesData } = await supabase.from('charities').select('*');
      const { data: winnersData } = await supabase.from('winners').select('*, profiles(full_name, email)');
      
      if (usersData) setUsers(usersData);
      if (charitiesData) setCharities(charitiesData);
      if (winnersData) setWinners(winnersData);
      
      setLoading(false);
    };

    checkAdmin();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const simulateDraw = () => {
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 45) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    setDrawResult(nums.sort((a, b) => a - b));
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Admin Control</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Super Admin</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => setActiveTab('dashboard')} className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'dashboard' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-secondary)', padding: '0.75rem' }}>
              <BarChart3 size={18} style={{ marginRight: '0.75rem' }} /> Analytics
            </button>
            <button onClick={() => setActiveTab('users')} className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'users' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'users' ? 'var(--accent-primary)' : 'var(--text-secondary)', padding: '0.75rem' }}>
              <Users size={18} style={{ marginRight: '0.75rem' }} /> Manage Users
            </button>
            <button onClick={() => setActiveTab('draws')} className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'draws' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'draws' ? 'var(--accent-primary)' : 'var(--text-secondary)', padding: '0.75rem' }}>
              <Target size={18} style={{ marginRight: '0.75rem' }} /> Draw Engine
            </button>
            <button onClick={() => setActiveTab('charities')} className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'charities' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'charities' ? 'var(--accent-primary)' : 'var(--text-secondary)', padding: '0.75rem' }}>
              <Heart size={18} style={{ marginRight: '0.75rem' }} /> Charities
            </button>
            <button onClick={() => setActiveTab('winners')} className="btn" style={{ justifyContent: 'flex-start', background: activeTab === 'winners' ? 'rgba(16, 185, 129, 0.1)' : 'transparent', color: activeTab === 'winners' ? 'var(--accent-primary)' : 'var(--text-secondary)', padding: '0.75rem' }}>
              <Trophy size={18} style={{ marginRight: '0.75rem' }} /> Winners
            </button>

            <button onClick={handleLogout} className="btn" style={{ justifyContent: 'flex-start', color: '#ef4444', padding: '0.75rem', marginTop: '2rem' }}>
              <LogOut size={18} style={{ marginRight: '0.75rem' }} /> Sign Out
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        
        {activeTab === 'dashboard' && (
          <div className="animate-fade-up">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Platform Analytics</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Active Users</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{users.length}</div>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600 }}>Connected Live</span>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Charities Supported</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{charities.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Draw Winners</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{winners.length}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="animate-fade-up">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Manage Users</h1>
            <div className="glass-panel">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Role</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem' }}>{u.full_name || 'N/A'}</td>
                      <td style={{ padding: '1rem' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}><span className={`tag ${u.role === 'admin' ? 'tag-gold' : ''}`}>{u.role}</span></td>
                      <td style={{ padding: '1rem' }}><span style={{ color: u.subscription_status === 'active' ? 'var(--accent-primary)' : '#ef4444' }}>{u.subscription_status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'charities' && (
          <div className="animate-fade-up">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Platform Charities</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {charities.map((c) => (
                <div key={c.id} className="glass-panel">
                  <h3>{c.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span className="tag">{c.category}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{c.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'draws' && (
          <div className="animate-fade-up">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Draw Execution Engine</h1>
            
            <div className="glass-panel" style={{ marginBottom: '2rem' }}>
              <h3>Run Monthly Draw</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select your algorithm type and run an internal simulation before publishing.</p>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Draw Logic</label>
                  <select className="form-control" style={{ background: 'var(--bg-surface)' }}>
                    <option value="random">Standard Random</option>
                    <option value="algorithmic">Algorithmic (Weighted Frequency)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={simulateDraw} className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>Run Internal Simulation</button>
                <button disabled={!drawResult} onClick={() => alert('Draw Published! Platform users notified.')} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Publish Official Draw</button>
              </div>

              {drawResult && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>SIMULATION RESULT:</span>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {drawResult.map((num, i) => (
                      <div key={i} style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, boxShadow: 'var(--shadow-glow)' }}>
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'winners' && (
          <div className="animate-fade-up">
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Winner Management</h1>
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
              {winners.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No winners recorded yet. Run a draw to generate potential winners.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '1rem' }}>Winner</th>
                      <th style={{ padding: '1rem' }}>Prize</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map((w) => (
                      <tr key={w.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '1rem' }}>{w.profiles?.full_name || w.profiles?.email || 'Unknown'}</td>
                        <td style={{ padding: '1rem' }}>${w.prize_amount}</td>
                        <td style={{ padding: '1rem' }}><span className="tag">{w.payment_status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
