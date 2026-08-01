import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import NaivedyamPage from './pages/NaivedyamPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import TableReservationPage from './pages/TableReservationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import FoodDetailsModal from './components/FoodDetailsModal';
import AuthModal from './components/AuthModal';
import FeedbackModal from './components/FeedbackModal';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [dailySpecial, setDailySpecial] = useState(null);
  const [cart, setCart] = useState([]);

  // User state
  const [user, setUser] = useState(null);

  // Modals state
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);

  // Checkout summary state
  const [cartSummary, setCartSummary] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Fetch initial data
  const loadData = () => {
    fetch('/api/menu/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(err => console.log('Categories fetch notice:', err));

    fetch('/api/menu/items')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setMenuItems(data); })
      .catch(err => console.log('Menu fetch notice:', err));

    fetch('/api/menu/daily-special')
      .then(res => res.json())
      .then(data => { if (data && data.name) setDailySpecial(data); })
      .catch(err => console.log('Daily special fetch notice:', err));
  };

  useEffect(() => {
    loadData();

    // Check token
    const token = localStorage.getItem('tr_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) setUser(data.user);
        })
        .catch(() => localStorage.removeItem('tr_token'));
    }
  }, []);

  // Cart operations
  const handleAddToCart = (item) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      setIsAuthOpen(true);
      return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === item.id);
      if (existing) {
        return prevCart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart(prevCart => prevCart.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
  };

  const handleRemoveItem = (itemId) => {
    setCart(prevCart => prevCart.filter(i => i.id !== itemId));
  };

  const handleProceedToCheckout = (summary) => {
    setCartSummary(summary);
    setCurrentPage('checkout');
  };

  const handleOrderSuccess = (orderData) => {
    setCart([]);
    setTrackingOrderId(orderData.orderId || orderData.order_number);
    setCurrentPage('tracking');

    // Trigger post-order feedback popup after 4 seconds
    setTimeout(() => {
      setFeedbackOrderId(orderData.orderId);
    }, 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('tr_token');
    setUser(null);
    setCurrentPage('home');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const naivedyamItems = menuItems.filter(i => i.category_slug === 'naivedyam');

  return (
    <div>
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartCount={totalCartCount}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenCart={() => setCurrentPage('cart')}
      />

      <main>
        {currentPage === 'home' && (
          <HomePage
            dailySpecial={dailySpecial}
            popularItems={menuItems}
            onAddToCart={handleAddToCart}
            onViewDetails={(item) => setSelectedFoodItem(item)}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            categories={categories}
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
            onViewDetails={(item) => setSelectedFoodItem(item)}
          />
        )}

        {currentPage === 'naivedyam' && (
          <NaivedyamPage
            naivedyamItems={naivedyamItems}
            onAddToCart={handleAddToCart}
            onViewDetails={(item) => setSelectedFoodItem(item)}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={handleProceedToCheckout}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            cartSummary={cartSummary || { grandTotal: 0, distanceKm: 8.5 }}
            user={user}
            onOrderSuccess={handleOrderSuccess}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'tracking' && (
          <OrderTrackingPage
            orderId={trackingOrderId}
            setCurrentPage={setCurrentPage}
            onTriggerFeedback={(orderId) => setFeedbackOrderId(orderId)}
          />
        )}

        {currentPage === 'reservation' && (
          <TableReservationPage
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {currentPage === 'orders' && (
          <OrderHistoryPage
            user={user}
            onSelectOrderForTracking={(id) => {
              setTrackingOrderId(id);
              setCurrentPage('tracking');
            }}
            onReorder={(items) => {
              items.forEach(it => handleAddToCart(it));
              setCurrentPage('cart');
            }}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'admin' && (
          <AdminDashboard
            user={user}
            menuItems={menuItems}
            categories={categories}
            onRefreshData={loadData}
          />
        )}
      </main>

      <Footer setCurrentPage={setCurrentPage} />

      {/* Modals */}
      {selectedFoodItem && (
        <FoodDetailsModal
          item={selectedFoodItem}
          onClose={() => setSelectedFoodItem(null)}
          onAddToCart={handleAddToCart}
          user={user}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(userData) => setUser(userData)}
        />
      )}

      {feedbackOrderId && (
        <FeedbackModal
          orderId={feedbackOrderId}
          onClose={() => setFeedbackOrderId(null)}
          user={user}
        />
      )}
    </div>
  );
};

export default App;
