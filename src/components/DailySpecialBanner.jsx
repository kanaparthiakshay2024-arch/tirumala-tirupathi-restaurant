import React from 'react';
import { Sparkles, Star, ShoppingBag, Flame, ShieldAlert } from 'lucide-react';

const DailySpecialBanner = ({ item, onAddToCart, onViewDetails }) => {
  if (!item) return null;

  return (
    <section style={{
      margin: '40px auto',
      maxWidth: '1200px',
      padding: '0 20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #380910 0%, #4A0E17 50%, #2A060B 100%)',
        border: '3px solid var(--gold-primary)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 35px rgba(74, 14, 23, 0.3)',
        color: '#FFF',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Special Golden Badge Ribbon */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'var(--gold-primary)',
          color: '#380910',
          padding: '6px 16px',
          borderRadius: '20px',
          fontWeight: 800,
          fontSize: '0.85rem',
          fontFamily: 'var(--font-heading)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 5,
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}>
          <Sparkles size={16} /> TODAY'S DAILY SPECIAL DISH
        </div>

        {/* Large Image Container */}
        <div style={{ position: 'relative', height: '100%', minHeight: '340px', overflow: 'hidden' }}>
          <img
            src={item.image_url || '/bhojanam.jpg'}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.95)'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent 60%, #380910 100%)'
          }} />
        </div>

        {/* Details & Order Section */}
        <div style={{ padding: '35px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="veg-badge">
              <span className="veg-dot"></span> Pure Veg
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold-primary)', fontSize: '0.9rem', fontWeight: 700 }}>
              <Star size={16} fill="var(--gold-primary)" /> {item.rating || 4.9} ({item.total_ratings || 240}+ Ratings)
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            color: 'var(--gold-glow)',
            fontWeight: 800,
            marginBottom: '10px'
          }}>
            {item.name}
          </h2>

          <p style={{ color: '#E0D6C3', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '18px' }}>
            {item.description}
          </p>

          {/* Pricing Highlight */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '18px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
              ₹{item.offer_price || item.price}
            </span>
            {item.offer_price && (
              <span style={{ fontSize: '1.2rem', color: '#B39D82', textDecoration: 'line-through' }}>
                ₹{item.price}
              </span>
            )}
            <span style={{
              backgroundColor: 'var(--green-btn)',
              color: '#FFF',
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 700
            }}>
              SPECIAL OFFER TODAY
            </span>
          </div>

          {/* Ingredients & Nutrition Grid */}
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '8px',
            padding: '12px 15px',
            marginBottom: '22px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            fontSize: '0.82rem'
          }}>
            <div>
              <strong style={{ color: 'var(--gold-primary)' }}>🌿 Ingredients:</strong>
              <div style={{ color: '#F3E5AB', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {item.ingredients || 'Pure Ghee, Rice, Saffron, Spices'}
              </div>
            </div>
            <div>
              <strong style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Flame size={13} /> Nutrition:
              </strong>
              <div style={{ color: '#F3E5AB' }}>
                {item.calories || 650} Calories • Satvik Prep
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onAddToCart(item)}
              className="btn-primary-green"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              <ShoppingBag size={18} /> Order Daily Special Now
            </button>

            <button
              onClick={() => onViewDetails(item)}
              className="btn-gold-outline"
              style={{ color: 'var(--gold-glow)', borderColor: 'var(--gold-primary)' }}
            >
              View Full Details & Reviews
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailySpecialBanner;
