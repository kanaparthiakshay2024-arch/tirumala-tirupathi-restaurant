import React, { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import FoodCard from '../components/FoodCard';

const MenuPage = ({ categories, menuItems, onAddToCart, onViewDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category_slug === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.ingredients && item.ingredients.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span style={{ color: 'var(--gold-dark)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.9rem' }}>
          🌿 100% PURE SOUTH INDIAN VEGETARIAN
        </span>
        <h1 className="section-title" style={{ marginTop: '5px' }}>Tirupati Veg Menu</h1>
        <p className="section-subtitle">Authentic tiffins, royal bhojanam, sacred offerings, crispy snacks & ghee sweets</p>
        <div className="gold-accent-line"></div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: 'var(--wood-card-bg)',
        border: '2px solid var(--gold-dark)',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }}>
        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedCategory === 'all' ? '1.5px solid var(--gold-primary)' : '1px solid #CCC',
              backgroundColor: selectedCategory === 'all' ? 'var(--maroon-header)' : 'var(--bg-cream-dark)',
              color: selectedCategory === 'all' ? 'var(--gold-glow)' : 'var(--text-dark)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            All Items ({menuItems.length})
          </button>

          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: selectedCategory === cat.slug ? '1.5px solid var(--gold-primary)' : '1px solid #CCC',
                backgroundColor: selectedCategory === cat.slug ? 'var(--maroon-header)' : 'var(--bg-cream-dark)',
                color: selectedCategory === cat.slug ? 'var(--gold-glow)' : 'var(--text-dark)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {cat.slug === 'naivedyam' && <Sparkles size={13} style={{ color: 'var(--gold-primary)' }} />}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Search Idli, Dosa, Meals, Laddu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '20px',
              border: '1px solid var(--gold-dark)',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Menu Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <h3>No dishes found matching your search.</h3>
          <p style={{ marginTop: '8px' }}>Try searching for Dosa, Idli, Meals, or Laddu.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {filteredItems.map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
