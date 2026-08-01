import React from 'react';
import { Sparkles, Heart, Sun, Flame } from 'lucide-react';
import FoodCard from '../components/FoodCard';

const NaivedyamPage = ({ naivedyamItems, onAddToCart, onViewDetails }) => {
  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #380910 0%, #4A0E17 100%)',
        border: '3px solid var(--gold-primary)',
        borderRadius: '16px',
        padding: '40px 30px',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--gold-primary)',
          color: '#380910',
          padding: '6px 18px',
          borderRadius: '20px',
          fontWeight: 800,
          fontFamily: 'var(--font-heading)',
          fontSize: '0.9rem',
          marginBottom: '15px'
        }}>
          <Sparkles size={16} /> HOLY NAIVEDYAM SELECTION
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--gold-glow)', fontWeight: 800 }}>
          Worship Offerings to Lord Vishnu
        </h1>

        <p style={{ color: '#F3E5AB', fontSize: '1.05rem', maxWidth: '800px', margin: '10px auto 0 auto', lineHeight: '1.6' }}>
          Explore the sacred food offerings dedicated to Lord Sri Venkateswara Swami. Each item is prepared with 100% Satvik purity, pure cow ghee, and ancient Vedic temple tradition, carrying deep spiritual significance.
        </p>
      </div>

      {/* Grid of Sacred Offerings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {naivedyamItems.map(item => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <FoodCard
              item={item}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
            {/* Spiritual Significance Box */}
            {item.worship_significance && (
              <div style={{
                backgroundColor: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--gold-dark)',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: 'var(--text-dark)',
                marginTop: '-6px'
              }}>
                <strong style={{ color: 'var(--maroon-header)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} style={{ color: 'var(--gold-dark)' }} /> Spiritual Significance:
                </strong>
                <p style={{ marginTop: '2px', lineHeight: '1.4' }}>{item.worship_significance}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NaivedyamPage;
