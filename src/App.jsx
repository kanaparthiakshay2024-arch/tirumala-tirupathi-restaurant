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

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Morning Tiffins', slug: 'breakfast', icon: '☕' },
  { id: 2, name: 'Afternoon Bhojanam & Meals', slug: 'lunch', icon: '🍛' },
  { id: 3, name: 'Evening Naivedyam & Dinner', slug: 'naivedyam', icon: '✨' }
];

const DEFAULT_MENU_ITEMS = [
  { id: 1, category_slug: 'breakfast', name: 'Idli', description: 'Steamed fluffy rice and lentil cakes served with authentic coconut chutney, tomato chutney, and piping hot sambar.', price: 60, offer_price: 50, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', time_slot: '6am-11am', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 180, ingredients: 'Raw Rice, Urad Dal, Fenugreek, Rock Salt, Coconut Chutney, Drumstick Sambar', allergens: 'None', calories: 180, preparation_style: 'Traditional Steaming', available: 1 },
  { id: 2, category_slug: 'breakfast', name: 'Ghee Idli', description: 'Soft steamed idlis drenched in generous aromatic pure cow ghee and sprinkled with podi (gunpowder spice).', price: 90, offer_price: 80, image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', time_slot: '6am-11am', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 210, ingredients: 'Raw Rice, Urad Dal, Pure Cow Ghee, Gunpowder Podi (Chana Dal, Sesame, Chilies)', allergens: 'Dairy', calories: 280, preparation_style: 'Steamed and Ghee Soaked', available: 1 },
  { id: 3, category_slug: 'breakfast', name: 'Medu Vada', description: 'Classic crunchy Medu Vada served with fresh green coconut chutney and aromatic drumstick sambar.', price: 80, offer_price: 70, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80', time_slot: '6am-11am', is_veg: 1, is_daily_special: 0, rating: 4.8, total_ratings: 165, ingredients: 'Urad Dal, Green Chilies, Cumin, Black Pepper, Ginger, Curry Leaves', allergens: 'None', calories: 310, preparation_style: 'Crispy Fried Ring', available: 1 },
  { id: 4, category_slug: 'breakfast', name: 'Ven Pongal', description: 'Traditional temple style Ven Pongal made with pure ghee and crushed black pepper, served with coconut chutney.', price: 100, offer_price: 90, image_url: '/pongal.jpg', time_slot: '6am-11am', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 230, ingredients: 'Raw Rice, Yellow Moong Dal, Pure Cow Ghee, Fried Cashews, Cumin, Black Pepper, Ginger', allergens: 'Nuts, Dairy', calories: 360, preparation_style: 'Tempered Temple Recipe', available: 1 },
  { id: 5, category_slug: 'breakfast', name: 'Masala Dosa', description: 'Crispy golden crepe stuffed with aromatic spiced potato masala, cooked on tawa with pure cow ghee.', price: 110, offer_price: 99, image_url: '/dosa.jpg', time_slot: '6am-11am', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 310, ingredients: 'Fermented Rice Batter, Pure Cow Ghee, Spiced Potato Masala, Mustard Seeds, Turmeric, Chutneys', allergens: 'Dairy', calories: 380, preparation_style: 'Crispy Tawa Griddled Crepe', available: 1 },
  { id: 6, category_slug: 'breakfast', name: 'Ghee Roast Dosa', description: 'Super thin paper crisp dosa roasted extravagantly in pure deshi ghee until golden perfection.', price: 140, offer_price: 125, image_url: '/dosa.jpg', time_slot: '6am-11am', is_veg: 1, is_daily_special: 0, rating: 5.0, total_ratings: 290, ingredients: 'Fermented Rice Batter, Pure Deshi Cow Ghee', allergens: 'Dairy', calories: 420, preparation_style: 'Golden Ghee Roast', available: 1 },

  { id: 7, category_slug: 'lunch', name: 'Srivari Maha Bhojanam', description: 'The ultimate royal temple feast served on a giant banana leaf with 18 sacred Satvik items and Tirupati Laddu.', price: 320, offer_price: 280, image_url: '/bhojanam.jpg', time_slot: '12pm-6pm', is_veg: 1, is_daily_special: 1, rating: 5.0, total_ratings: 420, ingredients: 'Pulihora, Chakkara Pongal, Sambar Rice, Daddojanam, Tirupati Laddu, Medu Vada, Vegetable Poriyal, Rasam, Payasam, Pure Ghee', allergens: 'Dairy, Nuts', calories: 1100, preparation_style: 'Grand Satvik Banana Leaf Banquet', worship_significance: 'Prepared following strict Tirumala temple Satvik culinary traditions without onion or garlic.', available: 1 },
  { id: 8, category_slug: 'lunch', name: 'South Indian Meals', description: 'Authentic South Indian Bhojanam with steamed rice, drumstick sambar, rasam, kootu, poriyal, curd, ghee, papad, and sweet.', price: 180, offer_price: 160, image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', time_slot: '12pm-6pm', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 310, ingredients: 'Steamed Rice, Sambar, Rasam, Poriyal, Avial, Curd, Ghee, Papad', allergens: 'Dairy', calories: 750, preparation_style: 'Banana Leaf Style Bhojanam', available: 1 },
  { id: 9, category_slug: 'lunch', name: 'Andhra Meals', description: 'Spicy authentic Andhra Bhojanam served with Gunpowder Podi, Nethi Ghee, Majjiga Pulusu, Vepudu, Gongura Pachadi.', price: 210, offer_price: 190, image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80', time_slot: '12pm-6pm', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 280, ingredients: 'Rice, Gongura Chutney, Podi, Ghee, Vegetable Fry, Majjiga Pulusu', allergens: 'Dairy', calories: 780, preparation_style: 'Traditional Andhra Style', available: 1 },
  { id: 10, category_slug: 'lunch', name: 'Pulihora Tamarind Rice', description: 'Tangy tamarind rice seasoned with mustard, green chilies, curry leaves, and crunchy roasted peanuts.', price: 110, offer_price: 95, image_url: '/pulihora.jpg', time_slot: '12pm-6pm', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 320, ingredients: 'Raw Rice, Tamarind Paste, Turmeric, Mustard Seeds, Curry Leaves, Peanuts', allergens: 'Nuts', calories: 410, preparation_style: 'Tempered Tamarind Rice', available: 1 },

  { id: 12, category_slug: 'naivedyam', name: 'Tirupati Laddu Prasadam', description: 'The world-famous sacred Srivari Laddu Prasadam enriched with pure deshi ghee, gram flour, sugar candy, cashew nuts, raisins, cardamom, and edible camphor (Pachcha Karpooram).', price: 120, offer_price: 100, image_url: '/laddu.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 5.0, total_ratings: 540, ingredients: 'Gram Flour (Besan), Pure Cow Ghee, Sugar Candy, Cashews, Raisins, Edible Camphor, Cardamom', allergens: 'Nuts, Dairy', calories: 450, preparation_style: 'Sacred Temple Recipe', worship_significance: 'Primary Naivedyam offered to Lord Sri Venkateswara Swami at Tirumala.', available: 1 },
  { id: 13, category_slug: 'naivedyam', name: 'Temple Pulihora Naivedyam', description: 'Sacred divine tamarind rice seasoned with turmeric, green chilies, mustard seeds, curry leaves, and roasted peanuts.', price: 110, offer_price: 95, image_url: '/pulihora.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 320, ingredients: 'Raw Rice, Tamarind Paste, Turmeric, Mustard Seeds, Curry Leaves, Peanuts', allergens: 'Nuts', calories: 390, preparation_style: 'Traditional Naivedyam Tempering', worship_significance: 'Symbolizes divine protection and purity in Vaishnava traditions.', available: 1 },
  { id: 14, category_slug: 'naivedyam', name: 'Sacred Chakkara Pongal', description: 'Rich jaggery and rice pudding simmered with milk, pure ghee, crushed cardamom, and ghee-fried cashews.', price: 120, offer_price: 100, image_url: '/pongal.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 275, ingredients: 'Raw Rice, Yellow Moong Dal, Organic Jaggery, Cow Ghee, Cashew Nuts, Cardamom', allergens: 'Nuts, Dairy', calories: 420, preparation_style: 'Slow Copper Pot Cooking', worship_significance: 'Sweet jaggery and ghee symbolize devotion and spiritual warmth.', available: 1 },
  { id: 15, category_slug: 'naivedyam', name: 'Daddojanam (Temple Curd Rice)', description: 'Cooling, velvety curd rice tempered with mustard seeds, curry leaves, ginger, and pomegranates.', price: 100, offer_price: 85, image_url: '/daddojanam.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 4.8, total_ratings: 210, ingredients: 'Raw Rice, Fresh Curd, Ginger, Mustard, Curry Leaves, Butter', allergens: 'Dairy', calories: 330, preparation_style: 'Tempered Satvik Curd', worship_significance: 'Grants peace of mind (Shanti) and physical cooling.', available: 1 }
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [dailySpecial, setDailySpecial] = useState(DEFAULT_MENU_ITEMS[6]);
  const [cart, setCart] = useState([]);

  // User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tirupati_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });

  // Modals state
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);

  // Checkout summary state
  const [cartSummary, setCartSummary] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState(null);

  // Safe Data Loader with static fallback handling
  const loadData = () => {
    fetch('/api/menu/categories')
      .then(res => {
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
      })
      .then(data => { if (Array.isArray(data) && data.length > 0) setCategories(data); })
      .catch(err => console.log('Categories fallback active:', err.message));

    fetch('/api/menu/items')
      .then(res => {
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
      })
      .then(data => { if (Array.isArray(data) && data.length > 0) setMenuItems(data); })
      .catch(err => console.log('Menu items fallback active:', err.message));

    fetch('/api/menu/daily-special')
      .then(res => {
        if (!res.ok) throw new Error('HTTP error ' + res.status);
        return res.json();
      })
      .then(data => { if (data && data.name) setDailySpecial(data); })
      .catch(err => console.log('Daily special fallback active:', err.message));
  };

  useEffect(() => {
    loadData();
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
    setTrackingOrderId(orderData.orderId || orderData.order_number || 'ORD-9821');
    setCurrentPage('tracking');

    setTimeout(() => {
      setFeedbackOrderId(orderData.orderId || 'ORD-9821');
    }, 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('tirupati_user');
    setUser(null);
    setCurrentPage('home');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const naivedyamItems = (menuItems || []).filter(i => i.category_slug === 'naivedyam');

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
            dailySpecial={dailySpecial || DEFAULT_MENU_ITEMS[6]}
            popularItems={menuItems || DEFAULT_MENU_ITEMS}
            onAddToCart={handleAddToCart}
            onViewDetails={(item) => setSelectedFoodItem(item)}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            categories={categories || DEFAULT_CATEGORIES}
            menuItems={menuItems || DEFAULT_MENU_ITEMS}
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
