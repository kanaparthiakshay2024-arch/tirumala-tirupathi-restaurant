import React from 'react';
import { Phone, Mail, MapPin, Clock, Heart, Award, ShieldCheck } from 'lucide-react';

const Footer = ({ setCurrentPage }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--maroon-header)',
      borderTop: '4px solid var(--gold-primary)',
      color: '#FFF',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Decorative Golden Arch Bar */}
      <div style={{
        backgroundColor: 'var(--maroon-deep)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '12px 20px',
        textAlign: 'center',
        color: 'var(--gold-glow)',
        fontFamily: 'var(--font-heading)',
        fontSize: '0.95rem',
        letterSpacing: '1px'
      }}>
        🛕 "Annadhanam Param Dhanam" — Serving Pure Satvik Temple Flavors with Devotion & Reverence
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 20px 20px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '30px'
      }}>
        {/* Brand & About */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <img src="/logo.jpg" alt="Tirupati Restaurant" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--gold-primary)' }} />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-primary)', fontSize: '1.25rem' }}>
                Tirupati Restaurant
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#F3E5AB' }}>Pure South Indian Vegetarian</p>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#E0D6C3', lineHeight: '1.6' }}>
            Inspired by the divine culinary traditions of Sri Venkateswara Swami Temple at Tirumala, Tirupati Restaurant brings you authentic, pure ghee Satvik dishes prepared with utmost hygiene and devotion.
          </p>
        </div>

        {/* Restaurant Leadership */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-primary)', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid var(--gold-dark)', paddingBottom: '6px' }}>
            Leadership & Culinary Team
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--gold-primary)' }} />
              <div>
                <strong style={{ color: '#F3E5AB' }}>Owner:</strong> Rachakonda Mithrakumar
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} style={{ color: 'var(--gold-primary)' }} />
              <div>
                <strong style={{ color: '#F3E5AB' }}>Manager:</strong> Kanaparthi Akshay
              </div>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={16} style={{ color: 'var(--gold-primary)' }} />
              <div>
                <strong style={{ color: '#F3E5AB' }}>Chief Chef:</strong> Koppula Koteshwar Rao
              </div>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-primary)', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid var(--gold-dark)', paddingBottom: '6px' }}>
            Explore Menu & Services
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><a onClick={() => setCurrentPage('menu')} style={{ color: '#E0D6C3', textDecoration: 'none', cursor: 'pointer' }}>• Pure Veg Breakfast & Tiffins</a></li>
            <li><a onClick={() => setCurrentPage('menu')} style={{ color: '#E0D6C3', textDecoration: 'none', cursor: 'pointer' }}>• Srivari Maha Bhojanam & Meals</a></li>
            <li><a onClick={() => setCurrentPage('naivedyam')} style={{ color: '#E0D6C3', textDecoration: 'none', cursor: 'pointer' }}>• Sacred Worship Offerings (Naivedyam)</a></li>
            <li><a onClick={() => setCurrentPage('reservation')} style={{ color: '#E0D6C3', textDecoration: 'none', cursor: 'pointer' }}>• Reserve a Table (Indoor/Outdoor)</a></li>
            <li><a onClick={() => setCurrentPage('contact')} style={{ color: '#E0D6C3', textDecoration: 'none', cursor: 'pointer' }}>• Contact & Helpline</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-primary)', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid var(--gold-dark)', paddingBottom: '6px' }}>
            Contact & Location
          </h4>
          <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px', color: '#E0D6C3' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={16} style={{ color: 'var(--gold-primary)', marginTop: '3px', shrink: 0 }} />
              <span>Tirupati Restaurant, Temple Road, Opp. Grand Gopuram, Andhra Pradesh, India</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Phone size={16} style={{ color: 'var(--gold-primary)', marginTop: '3px', shrink: 0 }} />
              <div>
                <div>+91 9346174197</div>
                <div>+91 9014228068</div>
                <div>+91 8247467209</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: 'var(--gold-primary)', shrink: 0 }} />
              <a href="mailto:tirumaltirupatirestarent@gmail.com" style={{ color: 'var(--gold-glow)', textDecoration: 'none' }}>
                tirumaltirupatirestarent@gmail.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <Clock size={16} style={{ color: 'var(--gold-primary)', shrink: 0 }} />
              <span>Open Daily: 6:00 AM – 11:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div style={{
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        backgroundColor: 'var(--maroon-deep)',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#F3E5AB'
      }}>
        © 2026 Tirupati Restaurant. All Rights Reserved. Prepared under guidance of Owner Rachakonda Mithrakumar, Manager Kanaparthi Akshay & Chief Chef Koppula Koteshwar Rao.
      </div>
    </footer>
  );
};

export default Footer;
