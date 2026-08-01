import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Download, RefreshCw, XCircle, ArrowRight } from 'lucide-react';

const OrderHistoryPage = ({ user, onSelectOrderForTracking, onReorder, setCurrentPage }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tr_token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/orders/my-orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCancelOrder = (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    const token = localStorage.getItem('tr_token');
    fetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: 'Cancelled' } : o));
        }
      });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2>Loading Your Past Orders...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
      <h1 className="section-title">My Order History</h1>
      <p className="section-subtitle">View past orders, track deliveries, download invoices & reorder meals</p>
      <div className="gold-accent-line"></div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <ShoppingBag size={55} style={{ color: 'var(--gold-dark)', margin: '0 auto 15px auto' }} />
          <h3>You haven't placed any orders yet.</h3>
          <button onClick={() => setCurrentPage('menu')} className="btn-primary-green" style={{ marginTop: '20px' }}>
            Explore Veg Menu
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
          {orders.map(order => (
            <div key={order.id} className="banana-leaf-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #EEE', paddingBottom: '12px' }}>
                <div>
                  <span style={{ fontWeight: 800, color: 'var(--maroon-header)', fontSize: '1.1rem' }}>
                    Order #{order.order_number}
                  </span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Placed on: {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: order.order_status === 'Delivered' ? '#E8F5E9' : order.order_status === 'Cancelled' ? '#FFEBEE' : '#FFF3E0',
                    color: order.order_status === 'Delivered' ? '#1B5E20' : order.order_status === 'Cancelled' ? '#C62828' : '#E65100',
                    border: '1px solid currentColor'
                  }}>
                    {order.order_status}
                  </span>

                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--green-btn)' }}>
                    ₹{order.grand_total}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div style={{ padding: '14px 0', fontSize: '0.88rem', color: 'var(--text-dark)' }}>
                {order.items && order.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{it.quantity}x {it.name || it.item_name}</span>
                    <span>₹{(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px dashed #DDD', paddingTop: '12px' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Delivery to: {order.house_no}, {order.area} (Sec Phone: +91 {order.secondary_mobile})
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {order.order_status !== 'Cancelled' && (
                    <button
                      onClick={() => onSelectOrderForTracking(order.id)}
                      className="btn-gold-outline"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      Track Order
                    </button>
                  )}

                  {order.order_status === 'Order Confirmed' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      style={{ background: 'none', border: '1px solid #C62828', color: '#C62828', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
                    >
                      Cancel Order
                    </button>
                  )}

                  <button
                    onClick={() => onReorder(order.items)}
                    className="btn-primary-green"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    <RefreshCw size={13} /> Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
