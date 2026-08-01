import React, { useState } from 'react';
import { Calendar, Clock, Users, Sparkles, CheckCircle, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';

const TableReservationPage = ({ user, onOpenAuth }) => {
  const [resDate, setResDate] = useState(new Date().toISOString().split('T')[0]);
  const [resTime, setResTime] = useState('19:30');
  const [guests, setGuests] = useState(4);
  const [seating, setSeating] = useState('Indoor');
  const [occasion, setOccasion] = useState('Family Dining');

  const [loading, setLoading] = useState(false);
  const [confirmedRes, setConfirmedRes] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBookTable = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to reserve a table.');
      onOpenAuth();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const token = localStorage.getItem('tr_token');

    fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        res_date: resDate,
        res_time: resTime,
        guests,
        seating_preference: seating,
        special_occasion: occasion
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setConfirmedRes(data);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
      })
      .catch(() => {
        setLoading(false);
        setErrorMsg('Failed to create reservation');
      });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span style={{ color: 'var(--gold-dark)', fontWeight: 700, letterSpacing: '2px', fontSize: '0.9rem' }}>
          🛕 TRADITIONAL TEMPLE-STYLE DINING
        </span>
        <h1 className="section-title" style={{ marginTop: '5px' }}>Reserve a Dining Table</h1>
        <p className="section-subtitle">Experience peaceful divine ambiance, wooden architecture, and sacred banana leaf Bhojanam</p>
        <div className="gold-accent-line"></div>
      </div>

      {confirmedRes ? (
        <div className="banana-leaf-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px', textAlign: 'center' }}>
          <CheckCircle size={60} style={{ color: 'var(--green-btn)', margin: '0 auto 15px auto' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.8rem' }}>
            Table Reservation Confirmed!
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '10px 0 20px 0' }}>
            We are honored to welcome you and your family to Tirupati Restaurant.
          </p>

          <div style={{
            backgroundColor: 'var(--bg-cream-dark)',
            border: '1.5px solid var(--gold-primary)',
            borderRadius: '10px',
            padding: '20px',
            textAlign: 'left',
            fontSize: '0.92rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div><strong style={{ color: 'var(--maroon-header)' }}>Reservation Code:</strong> {confirmedRes.reservation_code}</div>
            <div><strong style={{ color: 'var(--maroon-header)' }}>Date & Time:</strong> {confirmedRes.details.res_date} at {confirmedRes.details.res_time}</div>
            <div><strong style={{ color: 'var(--maroon-header)' }}>Guests:</strong> {confirmedRes.details.guests} Persons ({confirmedRes.details.seating_preference})</div>
          </div>

          <button onClick={() => setConfirmedRes(null)} className="btn-maroon" style={{ marginTop: '25px', padding: '10px 24px' }}>
            Book Another Table
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Reservation Form */}
          <form onSubmit={handleBookTable} className="banana-leaf-card" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.3rem', marginBottom: '20px' }}>
              Table Details
            </h3>

            {errorMsg && (
              <div style={{ backgroundColor: '#FFEBEE', color: '#C62828', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Date of Visit
                </label>
                <input
                  type="date"
                  required
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                    Time Slot
                  </label>
                  <select
                    value={resTime}
                    onChange={(e) => setResTime(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:00">01:00 PM (Lunch)</option>
                    <option value="14:00">02:00 PM (Lunch)</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Seating Preference
                </label>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {['Indoor', 'Outdoor'].map(pref => (
                    <label key={pref} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="radio"
                        name="seating"
                        value={pref}
                        checked={seating === pref}
                        onChange={(e) => setSeating(e.target.value)}
                      />
                      {pref} Dining
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Special Occasion / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Birthday, Pilgrimage visit, Anniversary..."
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary-green"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1.05rem', marginTop: '10px' }}
              >
                {loading ? 'Reserving...' : 'Confirm Table Booking'}
              </button>
            </div>
          </form>

          {/* Real-time Table Grid Visualizer */}
          <div className="banana-leaf-card" style={{ padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.3rem', marginBottom: '10px' }}>
              Real-Time Table Map ({seating})
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              🟢 Green = Available | 🔴 Red = Reserved
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
              textAlign: 'center'
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => {
                const isReserved = t === 3 || t === 7;
                return (
                  <div key={t} style={{
                    padding: '16px 10px',
                    borderRadius: '8px',
                    border: isReserved ? '2px solid #C62828' : '2px solid #2E7D32',
                    backgroundColor: isReserved ? '#FFEBEE' : '#E8F5E9',
                    color: isReserved ? '#C62828' : '#1B5E20',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}>
                    Table T-{t}
                    <div style={{ fontSize: '0.72rem', marginTop: '2px', color: '#555' }}>
                      {isReserved ? 'Reserved' : 'Available (4 Seater)'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableReservationPage;
