import React from 'react';
import { Sparkles, Calendar, ShoppingBag, ShieldCheck, Heart, Award, Star, Truck, ArrowRight } from 'lucide-react';
import DailySpecialBanner from '../components/DailySpecialBanner';
import FoodCard from '../components/FoodCard';

const HomePage = ({ dailySpecial, popularItems, onAddToCart, onViewDetails, setCurrentPage }) => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '520px',
        backgroundImage: `linear-gradient(rgba(56, 9, 16, 0.78), rgba(74, 14, 23, 0.85)), url('/hero_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 20px',
        borderBottom: '4px solid var(--gold-primary)',
        color: '#FFF'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Logo Badge */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: '3px solid var(--gold-primary)',
            margin: '0 auto 20px auto',
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.7)'
          }}>
            <img src="/logo.jpg" alt="Tirupati Restaurant Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <span style={{
            color: 'var(--gold-primary)',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.05rem',
            letterSpacing: '3px',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            Welcome to Divine Satvik Hospitality
          </span>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.8rem',
            fontWeight: 900,
            color: '#FFF',
            marginTop: '10px',
            marginBottom: '15px',
            lineHeight: 1.2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)'
          }}>
            TIRUPATI RESTAURANT
          </h1>

          <p style={{
            color: '#F3E5AB',
            fontSize: '1.15rem',
            maxWidth: '750px',
            margin: '0 auto 30px auto',
            lineHeight: 1.6,
            fontWeight: 500
          }}>
            Experience the sacred flavors of Lord Venkateswara Temple. Prepared with 100% pure cow ghee, organic ingredients, and divine Satvik traditions.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage('menu')}
              className="btn-primary-green"
              style={{ padding: '14px 32px', fontSize: '1.05rem' }}
            >
              <ShoppingBag size={20} /> Order Food Now
            </button>

            <button
              onClick={() => setCurrentPage('reservation')}
              className="btn-maroon"
              style={{ padding: '14px 32px', fontSize: '1.05rem', backgroundColor: 'transparent', borderColor: 'var(--gold-primary)' }}
            >
              <Calendar size={20} /> Reserve Table
            </button>
          </div>
        </div>
      </section>

      {/* Today's Special Dish */}
      {dailySpecial && (
        <DailySpecialBanner
          item={dailySpecial}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      )}

      {/* Featured Pure Veg Delicacies */}
      <section style={{ maxWidth: '1280px', margin: '50px auto', padding: '0 20px' }}>
        <h2 className="section-title">Popular Pure Veg Dishes</h2>
        <p className="section-subtitle">Crafted daily by Chief Chef Koppula Koteshwar Rao</p>
        <div className="gold-accent-line"></div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '25px',
          marginTop: '30px'
        }}>
          {popularItems.slice(0, 8).map(item => (
            <FoodCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '35px' }}>
          <button
            onClick={() => setCurrentPage('menu')}
            className="btn-maroon"
            style={{ padding: '12px 30px', fontSize: '1rem' }}
          >
            Explore Complete Veg Menu <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Sacred Worship Offerings Preview */}
      <section style={{
        backgroundColor: 'var(--bg-cream-dark)',
        borderTop: '2px solid var(--gold-dark)',
        borderBottom: '2px solid var(--gold-dark)',
        padding: '50px 20px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ color: 'var(--gold-dark)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.9rem' }}>
              🛕 HOLY NAIVEDYAM SELECTION
            </span>
            <h2 className="section-title" style={{ marginTop: '5px' }}>Worship Offerings to Lord Vishnu</h2>
            <p className="section-subtitle">Sacred prasadam items prepared with strict temple rituals and spiritual reverence</p>
            <div className="gold-accent-line"></div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {popularItems.filter(i => i.category_slug === 'naivedyam').slice(0, 3).map(item => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => setCurrentPage('naivedyam')}
              className="btn-primary-green"
              style={{ padding: '12px 28px' }}
            >
              <Sparkles size={18} /> View Sacred Naivedyam & Spiritual Significance
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ maxWidth: '1280px', margin: '60px auto', padding: '0 20px' }}>
        <h2 className="section-title">Why Choose Tirupati Restaurant</h2>
        <p className="section-subtitle">Unmatched Satvik purity, divine ambiance, and tradition</p>
        <div className="gold-accent-line"></div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px',
          marginTop: '40px'
        }}>
          <div className="banana-leaf-card" style={{ padding: '25px', textAlign: 'center' }}>
            <ShieldCheck size={40} style={{ color: 'var(--green-btn)', margin: '0 auto 15px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.25rem' }}>
              100% Pure Satvik Veg
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              No meat, eggs, artificial colors, or impurities. Prepared under strict hygiene standards.
            </p>
          </div>

          <div className="banana-leaf-card" style={{ padding: '25px', textAlign: 'center' }}>
            <Heart size={40} style={{ color: 'var(--gold-dark)', margin: '0 auto 15px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.25rem' }}>
              Pure Cow Ghee & Spices
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Authentic hand-ground spices and pure deshi cow ghee used in all sweets and meals.
            </p>
          </div>

          <div className="banana-leaf-card" style={{ padding: '25px', textAlign: 'center' }}>
            <Truck size={40} style={{ color: 'var(--maroon-header)', margin: '0 auto 15px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.25rem' }}>
              100 KM Delivery Radius
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Fresh hot temple meals delivered safely to your doorstep within a 100 km radius.
            </p>
          </div>

          <div className="banana-leaf-card" style={{ padding: '25px', textAlign: 'center' }}>
            <Award size={40} style={{ color: 'var(--gold-primary)', margin: '0 auto 15px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.25rem' }}>
              Master Chef Excellence
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Under guidance of Chief Chef Koppula Koteshwar Rao, Manager Kanaparthi Akshay & Owner Rachakonda Mithrakumar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
