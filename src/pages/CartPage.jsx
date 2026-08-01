import React, { useState } from 'react';
import { Trash2, Plus, Minus, Tag, ShoppingBag, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

const CartPage = ({ cart, onUpdateQuantity, onRemoveItem, onProceedToCheckout, setCurrentPage }) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [distanceKm, setDistanceKm] = useState(8.5);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = Math.round(subtotal * 0.05);

  // Delivery Fee
  const deliveryFee = distanceKm > 5 ? 30 + Math.round((distanceKm - 5) * 8) : 30;
  const discount = discountInfo ? discountInfo.discount_amount : 0;
  const grandTotal = Math.max(0, subtotal + taxAmount + deliveryFee - discount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    fetch('/api/admin/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, amount: subtotal })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setCouponError(data.error);
          setDiscountInfo(null);
        } else {
          setDiscountInfo(data);
        }
      })
      .catch(() => setCouponError('Failed to validate coupon'));
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px', textAlign: 'center', minHeight: '60vh' }}>
        <ShoppingBag size={70} style={{ color: 'var(--gold-dark)', margin: '0 auto 20px auto' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.8rem' }}>
          Your Devotee Feast Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '10px 0 25px 0' }}>
          Explore our authentic tiffins, royal bhojanam, and sacred Naivedyam prasadam to add items to your cart.
        </p>
        <button onClick={() => setCurrentPage('menu')} className="btn-primary-green" style={{ padding: '12px 28px' }}>
          Browse Pure Veg Menu
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <h1 className="section-title" style={{ marginBottom: '10px' }}>Your Dining Cart</h1>
      <div className="gold-accent-line"></div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        marginTop: '30px'
      }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {cart.map(item => (
            <div key={item.id} className="banana-leaf-card" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img
                src={item.image_url || '/bhojanam.jpg'}
                alt={item.name}
                style={{ width: '75px', height: '75px', borderRadius: '8px', objectFit: 'cover' }}
              />

              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="veg-badge" style={{ fontSize: '0.7rem' }}><span className="veg-dot"></span> Veg</span>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.05rem' }}>
                    {item.name}
                  </h4>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--green-btn)', fontWeight: 700, marginTop: '4px' }}>
                  ₹{item.offer_price || item.price}
                </div>
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-cream-dark)', padding: '4px 8px', borderRadius: '20px', border: '1px solid #DDD' }}>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemoveItem(item.id)}
                title="Remove item"
                style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Card */}
        <div>
          <div className="banana-leaf-card" style={{ padding: '22px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.25rem', marginBottom: '15px' }}>
              Order Summary
            </h3>

            {/* Delivery Radius Calculator */}
            <div style={{ backgroundColor: 'var(--bg-cream-dark)', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--maroon-header)' }}>
                <MapPin size={15} /> Estimated Delivery Distance (Max 100 km):
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                  style={{ flexGrow: 1 }}
                />
                <strong style={{ color: 'var(--gold-dark)' }}>{distanceKm} km</strong>
              </div>
              {distanceKm > 100 && (
                <span style={{ color: 'red', fontSize: '0.78rem' }}>Delivery restricted to 100km radius!</span>
              )}
            </div>

            {/* Coupon Code Section */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Coupon Code (e.g. TIRUPATI10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #CCC', textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn-gold-outline" style={{ padding: '8px 14px' }}>
                Apply
              </button>
            </form>

            {couponError && (
              <div style={{ color: '#C62828', fontSize: '0.8rem', marginBottom: '10px' }}>{couponError}</div>
            )}
            {discountInfo && (
              <div style={{ color: 'var(--green-btn)', fontSize: '0.84rem', fontWeight: 600, marginBottom: '10px' }}>
                {discountInfo.message}
              </div>
            )}

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', borderTop: '1px solid #EEE', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST Tax (5%)</span>
                <span>₹{taxAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Charge ({distanceKm} km)</span>
                <span>₹{deliveryFee}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--green-btn)', fontWeight: 600 }}>
                  <span>Coupon Discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justify: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--maroon-header)',
                borderTop: '2px solid var(--gold-primary)',
                paddingTop: '12px',
                marginTop: '6px'
              }}>
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout({ distanceKm, subtotal, taxAmount, deliveryFee, discount, grandTotal, couponCode })}
              className="btn-primary-green"
              style={{ width: '100%', justifyContent: 'center', marginTop: '20px', padding: '12px', fontSize: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
