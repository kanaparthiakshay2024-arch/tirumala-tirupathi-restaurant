import React from 'react';
import { Star, Plus, Eye, Sparkles } from 'lucide-react';

const FoodCard = ({ item, onAddToCart, onViewDetails }) => {
  return (
    <div className="banana-leaf-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image Container */}
      <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
        <img
          src={item.image_url || '/bhojanam.jpg'}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />

        {/* Veg Badge Overlay */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 3 }}>
          <span className="veg-badge" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
            <span className="veg-dot"></span> 100% Veg
          </span>
        </div>

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(74, 14, 23, 0.88)',
          color: 'var(--gold-primary)',
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          border: '1px solid var(--gold-primary)'
        }}>
          <Star size={13} fill="var(--gold-primary)" /> {item.rating || 4.8}
        </div>

        {/* Worship Offering Badge if applicable */}
        {item.category_slug === 'naivedyam' && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'var(--gold-primary)',
            color: '#380910',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <Sparkles size={11} /> Sacred Naivedyam
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 
          onClick={() => onViewDetails(item)}
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--maroon-header)',
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '6px',
            cursor: 'pointer'
          }}
        >
          {item.name}
        </h3>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.84rem',
          lineHeight: '1.4',
          marginBottom: '14px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flexGrow: 1
        }}>
          {item.description}
        </p>

        {/* Price & Action Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px dashed #E0D6C3'
        }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--maroon-header)' }}>
              ₹{item.offer_price || item.price}
            </span>
            {item.offer_price && (
              <span style={{ fontSize: '0.85rem', color: '#8D7B68', textDecoration: 'line-through', marginLeft: '6px' }}>
                ₹{item.price}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onViewDetails(item)}
              title="View Details"
              style={{
                background: 'var(--bg-cream-dark)',
                border: '1px solid var(--gold-dark)',
                color: 'var(--maroon-header)',
                borderRadius: '6px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => onAddToCart(item)}
              className="btn-primary-green"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              <Plus size={15} /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
