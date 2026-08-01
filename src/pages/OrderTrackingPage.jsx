import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Truck, Package, UtensilsCrossed, Download, Phone } from 'lucide-react';

const OrderTrackingPage = ({ orderId, setCurrentPage, onTriggerFeedback }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = () => {
      const token = localStorage.getItem('tr_token');
      fetch(`/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // refresh status
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2>Loading Live Order Status...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2>Order Not Found</h2>
        <button onClick={() => setCurrentPage('home')} className="btn-primary-green" style={{ marginTop: '20px' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const statuses = ['Order Confirmed', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'];
  const currentStep = statuses.indexOf(order.order_status);

  return (
    <div style={{ maxWidth: '950px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <div className="banana-leaf-card" style={{ padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <span style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: '0.85rem' }}>
              LIVE TRACKING • ORDER #{order.order_number}
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.8rem', marginTop: '4px' }}>
              Delivery Status
            </h1>
          </div>

          <div style={{ backgroundColor: 'var(--bg-cream-dark)', padding: '10px 18px', borderRadius: '10px', border: '1px solid var(--gold-dark)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated Delivery Time</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--green-btn)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={18} /> {order.estimated_delivery_time}
            </div>
          </div>
        </div>

        {/* Status Pipeline Progress Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '10px',
          margin: '40px 0 30px 0',
          position: 'relative',
          textAlign: 'center'
        }}>
          {statuses.map((s, index) => {
            const isDone = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: isDone ? 'var(--green-btn)' : '#E0E0E0',
                  color: isDone ? '#FFF' : '#888',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  border: isCurrent ? '3px solid var(--gold-primary)' : 'none',
                  boxShadow: isCurrent ? '0 0 12px rgba(212, 175, 55, 0.8)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {index === 0 && <CheckCircle2 size={20} />}
                  {index === 1 && <UtensilsCrossed size={20} />}
                  {index === 2 && <Package size={20} />}
                  {index === 3 && <Truck size={20} />}
                  {index === 4 && <CheckCircle2 size={20} />}
                </div>

                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: isCurrent ? 800 : 600,
                  color: isCurrent ? 'var(--maroon-header)' : '#666',
                  marginTop: '10px'
                }}>
                  {s}
                </div>
              </div>
            );
          })}
        </div>

        {order.order_status === 'Delivered' && (
          <div style={{
            backgroundColor: '#E8F5E9',
            border: '1.5px solid #2E7D32',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#1B5E20', fontFamily: 'var(--font-heading)' }}>Order Delivered! Enjoy your Satvik Feast.</h3>
            <button
              onClick={() => onTriggerFeedback(order.id)}
              className="btn-primary-green"
              style={{ marginTop: '10px', padding: '8px 20px', fontSize: '0.88rem' }}
            >
              Rate & Share Your Feedback
            </button>
          </div>
        )}

        {/* Invoice Summary */}
        <div style={{ borderTop: '2px dashed var(--gold-dark)', paddingTop: '20px', marginTop: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.2rem', marginBottom: '12px' }}>
            Order Items & Address
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.88rem' }}>
            <div>
              <strong>📍 Delivery Address:</strong>
              <div>{order.house_no}, {order.street}, {order.area}, {order.city} - {order.pin_code}</div>
              <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                Primary: +91 {order.primary_mobile} | Mandatory Sec: +91 {order.secondary_mobile}
              </div>
            </div>

            <div>
              <strong>💳 Payment & Total:</strong>
              <div>Method: {order.payment_method} ({order.payment_status})</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--maroon-header)', marginTop: '4px' }}>
                Grand Total: ₹{order.grand_total}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button
              onClick={() => alert(`Invoice #${order.order_number} downloaded successfully!`)}
              className="btn-gold-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} /> Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
