import React, { useState } from 'react';
import { CreditCard, Smartphone, ShieldCheck, MapPin, Truck, CheckCircle2 } from 'lucide-react';

const CheckoutPage = ({ cart, cartSummary, user, onOrderSuccess, setCurrentPage }) => {
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Tirupati');
  const [pinCode, setPinCode] = useState('517501');
  const [landmark, setLandmark] = useState('');
  const [primaryMobile, setPrimaryMobile] = useState(user ? user.mobile : '');
  const [secondaryMobile, setSecondaryMobile] = useState(''); // MANDATORY!
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!houseNo || !street || !area || !city || !pinCode || !primaryMobile) {
      return setErrorMsg('All primary address fields are required');
    }

    // MANDATORY Secondary Mobile Number validation
    if (!secondaryMobile || secondaryMobile.length < 10) {
      return setErrorMsg('Secondary Mobile Number is MANDATORY for delivery coordination!');
    }

    if (cartSummary.distanceKm > 100) {
      return setErrorMsg('Delivery is strictly limited to a 100 km radius of Tirupati Restaurant.');
    }

    setLoading(true);
    const token = localStorage.getItem('tr_token');

    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        house_no: houseNo,
        street,
        area,
        city,
        pin_code: pinCode,
        landmark,
        primary_mobile: primaryMobile,
        secondary_mobile: secondaryMobile,
        delivery_instructions: instructions,
        distance_km: cartSummary.distanceKm,
        items: cart,
        payment_method: paymentMethod,
        coupon_code: cartSummary.couponCode || ''
      })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          onOrderSuccess(data);
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg('Failed to process order placement.');
      });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <h1 className="section-title">Delivery Details & Payment</h1>
      <p className="section-subtitle">Tirupati Restaurant • Safe & Pure Satvik Delivery</p>
      <div className="gold-accent-line"></div>

      {errorMsg && (
        <div style={{ backgroundColor: '#FFEBEE', color: '#C62828', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {/* Address Form Column */}
        <div className="banana-leaf-card" style={{ padding: '25px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} style={{ color: 'var(--gold-dark)' }} /> Delivery Address (Within 100 km Radius)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  House / Flat No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Sri Nilayam"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Street Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temple Road"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Area / Colony *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kapilatheertham Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="517501"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Near Temple Arch"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>
            </div>

            {/* MANDATORY Secondary Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon-header)', display: 'block', marginBottom: '4px' }}>
                  Primary Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={primaryMobile}
                  onChange={(e) => setPrimaryMobile(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#C62828', display: 'block', marginBottom: '4px' }}>
                  Secondary Mobile (Mandatory) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Alternative 10-digit phone"
                  value={secondaryMobile}
                  onChange={(e) => setSecondaryMobile(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '2px solid #C62828' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Leave at security desk, Ring bell twice..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #CCC' }}
              />
            </div>
          </div>
        </div>

        {/* Payment Options Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="banana-leaf-card" style={{ padding: '25px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.2rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} style={{ color: 'var(--gold-dark)' }} /> Select Payment Option
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'].map(method => (
                <label
                  key={method}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: paymentMethod === method ? '2px solid var(--gold-primary)' : '1px solid #DDD',
                    backgroundColor: paymentMethod === method ? 'var(--bg-cream-dark)' : '#FFF',
                    cursor: 'pointer',
                    fontWeight: paymentMethod === method ? 700 : 500
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Grand Total & Submit Button */}
          <div className="banana-leaf-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, color: 'var(--maroon-header)' }}>
              <span>Total Payable</span>
              <span>₹{cartSummary.grandTotal}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-green"
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '14px', fontSize: '1.1rem' }}
            >
              {loading ? 'Confirming Order...' : 'Confirm Order & Pay'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
