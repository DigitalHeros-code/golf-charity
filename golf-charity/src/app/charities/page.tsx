'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Search, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function CharitiesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [charities, setCharities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchCharities = async () => {
      const { data } = await supabase
        .from('charities')
        .select('*');
      
      if (data) {
        setCharities(data);
      }
      setLoading(false);
    };

    fetchCharities();
  }, []);

  const filtered = charities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         (c.description && c.description.toLowerCase().includes(search.toLowerCase()));
    // Note: In real DB we should have category column, if not we skip filter or mock it
    const matchesFilter = filter === 'All' || c.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container animate-fade-up" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Impact <span className="text-gradient-emerald">Directory</span></h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Explore the vetted organizations you can support through your ImpactSwing subscription. At least 10% of every subscription goes directly to these causes.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
          <input 
            type="text" 
            placeholder="Search charities..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control" 
            style={{ paddingLeft: '3rem' }}
          />
        </div>
        <select 
          className="form-control" 
          style={{ width: '200px' }}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Health">Health & Research</option>
          <option value="Youth">Youth Empowerment</option>
          <option value="Environment">Environmental</option>
          <option value="Education">Education</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filtered.map(c => (
          <div key={c.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{c.name}</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{c.category || 'General'}</span>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {c.location || 'Global'}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>{c.description}</p>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ExternalLink size={16} /> View Profile
              </button>
              <button onClick={() => window.location.href='/subscribe'} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={16} /> Support
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <p>No charities match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
