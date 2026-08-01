import React from 'react';
import { ShoppingBag, Calendar, User, Shield, Phone, Sparkles, LogOut } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

const Navbar = ({ currentPage, setCurrentPage, cartCount, user, onOpenAuth, onLogout, onOpenCart }) => {
  return (
    <header style={{
      backgroundColor: 'var(--maroon-header)',
      borderBottom: '3px solid var(--gold-primary)',
      color: '#FFF',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    }}>
      {/* Top Banner Contact Strip */}
      <div style={{
        backgroundColor: 'var(--maroon-deep)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '4px 20px',
        fontSize: '0.78rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#F3E5AB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>🛕 Welcome to Tirupati Restaurant - Pure Satvik South Indian Dining</span>
          <span style={{ display: 'none', md: 'inline' }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={12} /> Helpline: +91 9346174197, +91 9014228068
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <AudioPlayer />
        </div>
      </div>

      {/* Main Nav Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        {/* Logo & Title */}
        <div 
          onClick={() => setCurrentPage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: '2px solid var(--gold-primary)',
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)',
            background: '#FFF'
          }}>
            <img src="/logo.jpg" alt="Tirupati Restaurant Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: 'var(--gold-primary)',
              letterSpacing: '1px',
              lineHeight: 1.1
            }}>
              TIRUPATI RESTAURANT
            </h1>
            <p style={{
              fontSize: '0.72rem',
              color: '#F3E5AB',
              letterSpacing: '0.5px',
              fontWeight: 500
            }}>
              Pure South Indian Vegetarian • Devotee Delight
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <button
            onClick={() => setCurrentPage('home')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPage === 'home' ? 'var(--gold-primary)' : '#FFF',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              borderBottom: currentPage === 'home' ? '2px solid var(--gold-primary)' : 'none',
              paddingBottom: '2px'
            }}
          >
            Home
          </button>

          <button
            onClick={() => setCurrentPage('menu')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPage === 'menu' ? 'var(--gold-primary)' : '#FFF',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              borderBottom: currentPage === 'menu' ? '2px solid var(--gold-primary)' : 'none',
              paddingBottom: '2px'
            }}
          >
            Veg Menu
          </button>

          <button
            onClick={() => setCurrentPage('naivedyam')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPage === 'naivedyam' ? 'var(--gold-primary)' : '#FFF',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              borderBottom: currentPage === 'naivedyam' ? '2px solid var(--gold-primary)' : 'none',
              paddingBottom: '2px'
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--gold-primary)' }} />
            Naivedyam
          </button>

          <button
            onClick={() => setCurrentPage('reservation')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPage === 'reservation' ? 'var(--gold-primary)' : '#FFF',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              borderBottom: currentPage === 'reservation' ? '2px solid var(--gold-primary)' : 'none',
              paddingBottom: '2px'
            }}
          >
            <Calendar size={14} /> Book Table
          </button>

          <button
            onClick={() => setCurrentPage('contact')}
            style={{
              background: 'none',
              border: 'none',
              color: currentPage === 'contact' ? 'var(--gold-primary)' : '#FFF',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              borderBottom: currentPage === 'contact' ? '2px solid var(--gold-primary)' : 'none',
              paddingBottom: '2px'
            }}
          >
            Contact
          </button>

          {user && (user.role === 'admin' || user.role === 'manager') && (
            <button
              onClick={() => setCurrentPage('admin')}
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid var(--gold-primary)',
                color: 'var(--gold-glow)',
                padding: '4px 10px',
                borderRadius: '4px',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Shield size={13} /> Admin Panel
            </button>
          )}
        </nav>

        {/* User Account & Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={onOpenCart}
            style={{
              background: 'var(--green-btn)',
              color: '#FFF',
              border: '1px solid var(--gold-primary)',
              borderRadius: '20px',
              padding: '6px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <ShoppingBag size={17} style={{ color: 'var(--gold-glow)' }} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                background: 'var(--gold-primary)',
                color: '#380910',
                borderRadius: '50%',
                padding: '2px 7px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setCurrentPage('orders')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F3E5AB',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                My Orders
              </button>
              <button
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#FFF',
                  padding: '6px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-maroon"
              style={{ padding: '6px 16px', fontSize: '0.85rem' }}
            >
              <User size={15} /> Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
