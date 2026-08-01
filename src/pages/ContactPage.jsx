import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Award, Heart, Send, CheckCircle2 } from 'lucide-react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <span style={{ color: 'var(--gold-dark)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.9rem' }}>
          📞 GET IN TOUCH WITH US
        </span>
        <h1 className="section-title" style={{ marginTop: '5px' }}>Contact Tirupati Restaurant</h1>
        <p className="section-subtitle">We are always available to assist with catering, party orders, and dining inquiries</p>
        <div className="gold-accent-line"></div>
      </div>

      {/* Leadership & Contact Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        marginBottom: '40px'
      }}>
        {/* Owner Card */}
        <div className="banana-leaf-card" style={{ padding: '25px', textAlign: 'center' }}>
          <ShieldCheck size={40} style={{ color: 'var(--gold-dark)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.3rem' }}>
            Rachakonda Mithrakumar
          </h3>
          <p style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: '0.85rem' }}>Restaurant Owner</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Directing authentic Satvik heritage and hospitality.
          </p>
        </div>

        {/* Manager Card */}
        <div className="banana-leaf-card" style={{ padding: '25px', textAlign: 'center' }}>
          <Award size={40} style={{ color: 'var(--green-btn)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.3rem' }}>
            Kanaparthi Akshay
          </h3>
          <p style={{ color: 'var(--green-btn)', fontWeight: 700, fontSize: '0.85rem' }}>General Manager</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Overseeing reservations, customer service, and dining operations.
          </p>
        </div>

        {/* Chief Chef Card */}
        <div className="banana-leaf-card" style={{ padding: '25px', textAlign: 'center' }}>
          <Heart size={40} style={{ color: 'var(--maroon-header)', margin: '0 auto 12px auto' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.3rem' }}>
            Koppula Koteshwar Rao
          </h3>
          <p style={{ color: 'var(--maroon-header)', fontWeight: 700, fontSize: '0.85rem' }}>Chief Chef</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Mastering traditional temple recipes and pure cow ghee delicacies.
          </p>
        </div>
      </div>

      {/* Main Info & Form Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '35px' }}>
        {/* Contact Info Card */}
        <div className="banana-leaf-card" style={{ padding: '30px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.4rem', marginBottom: '20px' }}>
            Helpline & Address
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Phone size={22} style={{ color: 'var(--gold-dark)', shrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--maroon-header)', display: 'block' }}>Contact Phone Numbers:</strong>
                <div style={{ color: 'var(--text-dark)', marginTop: '4px', fontWeight: 600 }}>
                  <div>+91 9346174197</div>
                  <div>+91 9014228068</div>
                  <div>+91 8247467209</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Mail size={22} style={{ color: 'var(--gold-dark)', shrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--maroon-header)', display: 'block' }}>Official Email Address:</strong>
                <a href="mailto:tirumaltirupatirestarent@gmail.com" style={{ color: 'var(--green-btn)', fontWeight: 700, textDecoration: 'none' }}>
                  tirumaltirupatirestarent@gmail.com
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <MapPin size={22} style={{ color: 'var(--gold-dark)', shrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--maroon-header)', display: 'block' }}>Restaurant Address:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                  Tirupati Restaurant, Temple Road, Opp. Grand Gopuram Arch, Tirupati, Andhra Pradesh - 517501, India.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="banana-leaf-card" style={{ padding: '30px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.4rem', marginBottom: '20px' }}>
            Send Us a Message
          </h3>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <CheckCircle2 size={50} style={{ color: 'var(--green-btn)', margin: '0 auto 12px auto' }} />
              <h3 style={{ color: 'var(--maroon-header)', fontFamily: 'var(--font-heading)' }}>Message Sent Successfully!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                Thank you for contacting Tirupati Restaurant. Our management team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit phone"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Message or Inquiry *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Catering inquiries, bulk Laddu orders, or dining reservation questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>

              <button type="submit" className="btn-primary-green" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                <Send size={16} /> Send Message to Management
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
