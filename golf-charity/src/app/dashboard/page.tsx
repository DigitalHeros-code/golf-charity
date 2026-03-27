'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Target, Trophy, Heart, LogOut, Loader2, Activity } from 'lucide-react';

interface Score {
  id: string;
  value: number;
  date: string;
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [newScore, setNewScore] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, charities(*)')
        .eq('id', user.id)
        .single();
      
      if (profileData?.role === 'admin') {
        router.push('/admin');
        return;
      }
      setProfile(profileData);

      // Fetch Scores (Rolling 5 logic handled on fetch too)
      const { data: scoreData } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)
        .order('date_played', { ascending: false })
        .limit(5);

      if (scoreData) {
        setScores(scoreData.map(s => ({
          id: s.id,
          value: s.score_value,
          date: s.date_played
        })));
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const addScore = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newScore);
    if (val < 1 || val > 45) return alert('Score must be between 1 and 45.');

    const { data: newEntry, error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score_value: val,
        date_played: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }
    
    // Refresh scores after adding
    const { data: updatedScores } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('date_played', { ascending: false })
      .limit(5);

    if (updatedScores) {
      setScores(updatedScores.map(s => ({
        id: s.id,
        value: s.score_value,
        date: s.date_played
      })));
    }
    setNewScore('');
  };

  const deleteScore = async (id: string) => {
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id);

    if (!error) {
      setScores(scores.filter(s => s.id !== id));
    }
  };

  if (!user) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Player Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.email}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Subscription Panel */}
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Activity className="text-gradient-emerald" size={24} /> Subscription</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <span>Status</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.875rem' }}>Active</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)' }}>
            <span>Plan</span>
            <strong style={{ textTransform: 'capitalize' }}>{profile?.subscription_tier || 'Free'} Target</strong>
          </div>
        </div>

        {/* Impact Panel */}
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Heart className="text-gradient-emerald" size={24} /> Your Impact</h3>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {profile?.charity_percentage || 10}% <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>contribution</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Currently routing to {profile?.charities?.name || 'Vetted Charities'}. Keep playing to drive more donations towards {profile?.charities?.name || 'impactful causes'}.
          </p>
        </div>

        {/* Winnings Panel */}
        <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))', border: '1px solid var(--accent-secondary)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Trophy color="var(--accent-secondary)" size={24} /> Draw Winnings</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>
            $0.00
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Upcoming Draw: End of Month. Ensure 5 scores are logged to validate your entry!
          </p>
        </div>
      </div>

      {/* Scores Panel */}
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Target className="text-gradient-emerald" size={24} /> Your Draw Entry (Last 5 Scores)</h3>
        
        <form onSubmit={addScore} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="number" 
            className="form-control" 
            placeholder="Enter Stableford Score (1-45)" 
            value={newScore} 
            onChange={e => setNewScore(e.target.value)} 
            min="1" max="45"
            required 
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>Add Score</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {scores.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No scores yet. Enter 5 scores to form your draw entry.</p>
          ) : (
            scores.map((s, idx) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.25rem' }}>{s.value} pts</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => deleteScore(s.id)} style={{ color: '#ef4444', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-md)' }}>Rem</button>
              </div>
            ))
          )}
        </div>
        
        {scores.length < 5 && (
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'inline-block' }} /> 
            You need {5 - scores.length} more score(s) to complete your draw entry.
          </div>
        )}
      </div>

    </div>
  );
}
