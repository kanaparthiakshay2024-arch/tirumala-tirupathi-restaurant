import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Check, RefreshCw, BarChart2, Utensils, Calendar, Star, Package } from 'lucide-react';

const AdminDashboard = ({ user, menuItems, categories, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, menu, daily_special, reservations, analytics, reviews
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add Item state
  const [newItem, setNewItem] = useState({
    name: '', category_slug: 'breakfast', description: '', price: '', offer_price: '',
    image_url: '/bhojanam.jpg', ingredients: '', allergens: '', calories: 300, preparation_style: 'Satvik Prep', worship_significance: ''
  });

  const token = localStorage.getItem('tr_token');

  const fetchOrders = () => {
    fetch('/api/orders/admin/all', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); });
  };

  const fetchReservations = () => {
    fetch('/api/reservations/admin/all', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setReservations(data); });
  };

  const fetchAnalytics = () => {
    fetch('/api/admin/summary', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAnalytics(data));
  };

  useEffect(() => {
    fetchOrders();
    fetchReservations();
    fetchAnalytics();
  }, []);

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchOrders();
        fetchAnalytics();
      });
  };

  const handleSetDailySpecial = (itemId) => {
    fetch(`/api/menu/daily-special/${itemId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        onRefreshData();
      });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    fetch('/api/menu/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newItem)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        onRefreshData();
        setNewItem({
          name: '', category_slug: 'breakfast', description: '', price: '', offer_price: '',
          image_url: '/bhojanam.jpg', ingredients: '', allergens: '', calories: 300, preparation_style: 'Satvik Prep', worship_significance: ''
        });
      });
  };

  const handleDeleteItem = (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    fetch(`/api/menu/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        onRefreshData();
      });
  };

  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <Shield size={60} style={{ color: '#C62828', margin: '0 auto 15px auto' }} />
        <h2>Admin Access Required</h2>
        <p style={{ color: 'var(--text-muted)' }}>Please log in with admin credentials (e.g. admin@tirupatirestaurant.com / admin123).</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 20px', minHeight: '85vh' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--maroon-header)',
        border: '3px solid var(--gold-primary)',
        borderRadius: '14px',
        padding: '25px',
        color: '#FFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '55px', height: '55px', borderRadius: '50%', border: '2px solid var(--gold-primary)' }} />
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-primary)', fontSize: '1.6rem' }}>
              Admin Management Console
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#F3E5AB' }}>
              Owner Rachakonda Mithrakumar • Manager Kanaparthi Akshay • Chief Chef Koppula Koteshwar Rao
            </p>
          </div>
        </div>

        {/* Analytics Pill Stats */}
        {analytics && (
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-glow)' }}>Total Revenue</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{analytics.total_revenue}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-glow)' }}>Total Orders</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{analytics.total_orders}</div>
            </div>
          </div>
        )}
      </div>

      {/* Admin Tabs Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '25px' }}>
        {[
          { id: 'orders', label: 'Manage Orders', icon: Package },
          { id: 'menu', label: 'Manage Menu Items', icon: Utensils },
          { id: 'daily_special', label: 'Change Daily Special', icon: Star },
          { id: 'reservations', label: 'Table Bookings', icon: Calendar },
          { id: 'analytics', label: 'Sales Reports & Chef Dashboard', icon: BarChart2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: isActive ? '2px solid var(--gold-primary)' : '1px solid #CCC',
                backgroundColor: isActive ? 'var(--maroon-header)' : 'var(--bg-cream-dark)',
                color: isActive ? 'var(--gold-glow)' : 'var(--text-dark)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MANAGE ORDERS */}
      {activeTab === 'orders' && (
        <div className="banana-leaf-card" style={{ padding: '25px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.4rem', marginBottom: '20px' }}>
            Live Orders Pipeline
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ border: '1px solid #DDD', borderRadius: '8px', padding: '16px', backgroundColor: '#FFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <strong style={{ color: 'var(--maroon-header)', fontSize: '1.05rem' }}>Order #{order.order_number}</strong>
                    <div style={{ fontSize: '0.82rem', color: '#666' }}>Customer: {order.user_name} | Primary: +91 {order.primary_mobile} | Sec: +91 {order.secondary_mobile}</div>
                    <div style={{ fontSize: '0.82rem', color: '#666' }}>Address: {order.house_no}, {order.street}, {order.area}, {order.city} ({order.distance_km} km)</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green-btn)' }}>₹{order.grand_total}</span>
                    <select
                      value={order.order_status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1.5px solid var(--gold-dark)', fontWeight: 700 }}
                    >
                      <option value="Order Confirmed">Order Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Packed">Packed</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '10px', fontSize: '0.84rem', color: '#444', backgroundColor: 'var(--bg-cream-dark)', padding: '8px', borderRadius: '6px' }}>
                  Items: {order.items && order.items.map(i => `${i.quantity}x ${i.name || i.item_name}`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE MENU ITEMS */}
      {activeTab === 'menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* Add New Item Form */}
          <form onSubmit={handleAddItem} className="banana-leaf-card" style={{ padding: '25px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.25rem', marginBottom: '15px' }}>
              Add New Pure Veg Dish
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" required placeholder="Dish Name (e.g. Ghee Masala Dosa)" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }} />
              <select value={newItem.category_slug} onChange={(e) => setNewItem({ ...newItem, category_slug: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch & Meals</option>
                <option value="naivedyam">Naivedyam</option>
                <option value="snacks">Snacks</option>
                <option value="desserts">Desserts</option>
                <option value="drinks">Drinks</option>
              </select>
              <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input type="number" required placeholder="Price ₹" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }} />
                <input type="number" placeholder="Offer Price ₹" value={newItem.offer_price} onChange={(e) => setNewItem({ ...newItem, offer_price: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }} />
              </div>
              <input type="text" placeholder="Image URL" value={newItem.image_url} onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }} />
              <input type="text" placeholder="Ingredients" value={newItem.ingredients} onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CCC' }} />
              <button type="submit" className="btn-primary-green" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                <Plus size={16} /> Add Dish to Menu
              </button>
            </div>
          </form>

          {/* Menu Items Table */}
          <div className="banana-leaf-card" style={{ padding: '25px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.25rem', marginBottom: '15px' }}>
              Current Menu Items ({menuItems.length})
            </h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menuItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #DDD' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.image_url} alt="" style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ fontSize: '0.9rem' }}>{item.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>₹{item.offer_price || item.price} | {item.category_slug}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteItem(item.id)} style={{ background: 'none', border: 'none', color: '#C62828', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHANGE DAILY SPECIAL */}
      {activeTab === 'daily_special' && (
        <div className="banana-leaf-card" style={{ padding: '30px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.4rem', marginBottom: '10px' }}>
            Select Today's Special Dish
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            The chosen item automatically appears as the large featured Daily Special banner on the Home Page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {menuItems.map(item => (
              <div key={item.id} style={{
                border: item.is_daily_special ? '3px solid var(--gold-primary)' : '1px solid #DDD',
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: item.is_daily_special ? 'var(--bg-cream-dark)' : '#FFF',
                textAlign: 'center'
              }}>
                <img src={item.image_url} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', marginTop: '8px' }}>{item.name}</h4>
                <div style={{ fontWeight: 700, color: 'var(--green-btn)', margin: '4px 0 10px 0' }}>₹{item.offer_price || item.price}</div>
                {item.is_daily_special ? (
                  <span style={{ backgroundColor: 'var(--gold-primary)', color: '#380910', padding: '4px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem' }}>
                    CURRENT DAILY SPECIAL
                  </span>
                ) : (
                  <button onClick={() => handleSetDailySpecial(item.id)} className="btn-gold-outline" style={{ width: '100%', padding: '6px' }}>
                    Set as Daily Special
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TABLE RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="banana-leaf-card" style={{ padding: '25px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.4rem', marginBottom: '20px' }}>
            Customer Table Bookings
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reservations.map(res => (
              <div key={res.id} style={{ padding: '14px', border: '1px solid #DDD', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'var(--maroon-header)' }}>{res.user_name}</strong> ({res.user_mobile})
                  <div style={{ fontSize: '0.82rem', color: '#666' }}>
                    Date: {res.res_date} at {res.res_time} | {res.guests} Guests ({res.seating_preference}) | Code: {res.reservation_code}
                  </div>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: '#E8F5E9', color: '#1B5E20', fontWeight: 700, fontSize: '0.8rem' }}>
                  {res.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SALES & CHEF DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="banana-leaf-card" style={{ padding: '30px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon-header)', fontSize: '1.4rem', marginBottom: '15px' }}>
            Chef & Operations Dashboard
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-cream-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--gold-primary)' }}>
              <h3>👨‍🍳 Chief Chef View</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                Chief Chef Koppula Koteshwar Rao overview: All 45 Satvik items in stock. pure cow ghee levels optimal.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-cream-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--gold-primary)' }}>
              <h3>💼 Management Team</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                Owner Rachakonda Mithrakumar & Manager Kanaparthi Akshay operational checklist verified clean.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
