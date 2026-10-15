const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

const EXACT_ADDRESS = "Tirumala Tirupati Restaurant, Near Tata Automobile Showroom, Beside Tirupati Busstand, PIN code 517501, Andhra Pradesh, India";

// --- DATABASE SEED DATA ---
let dbData = {
  users: [
    {
      id: 1,
      name: "Admin Manager",
      mobile: "9346174197",
      email: "admin@tirupatirestaurant.com",
      password_hash: crypto.createHash('sha256').update('admin123').digest('hex'),
      role: "admin"
    },
    {
      id: 2,
      name: "Devotee Customer",
      mobile: "9014228068",
      email: "devotee@tirupati.com",
      password_hash: crypto.createHash('sha256').update('demo123').digest('hex'),
      role: "customer"
    }
  ],
  categories: [
    { name: 'Breakfast & Tiffins (6 AM - 11 AM)', slug: 'breakfast', time_slot: '6am-11am', description: 'Traditional South Indian morning tiffins prepared with pure ghee and fresh chutneys.' },
    { name: 'Lunch & Afternoon Meals (12 PM - 6 PM)', slug: 'lunch', time_slot: '12pm-6pm', description: 'Royal Satvik meals and aromatic spice rice preparations served with authentic recipes.' },
    { name: 'Worship Offerings (Naivedyam)', slug: 'naivedyam', time_slot: '6pm-11pm', description: 'Sacred food preparations dedicated to Lord Sri Venkateswara with deep spiritual reverence.' },
    { name: 'Dinner & Evening Delights (6 PM - 11 PM)', slug: 'dinner', time_slot: '6pm-11pm', description: 'Comforting evening dosas, rotis, satvik thalis, and hot soup preparations.' },
    { name: 'Snacks', slug: 'snacks', time_slot: 'all-day', description: 'Crispy, freshly fried tea-time treats and authentic savory bites.' },
    { name: 'Desserts', slug: 'desserts', time_slot: 'all-day', description: 'Traditional ghee sweets, fragrant halwas, and Tirupati Prasadam treats.' },
    { name: 'Drinks', slug: 'drinks', time_slot: 'all-day', description: 'Cooling herbal beverages, fresh juices, badam milk, and authentic South Indian Filter Coffee.' }
  ],
  menu_items: [
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
    { id: 11, category_slug: 'lunch', name: 'Vegetable Dum Biryani', description: 'Long grain basmati rice slow cooked with garden fresh vegetables, saffron, and aromatic biryani spices in a handi.', price: 180, offer_price: 160, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', time_slot: '12pm-6pm', is_veg: 1, is_daily_special: 0, rating: 4.8, total_ratings: 230, ingredients: 'Basmati Rice, Carrots, Green Beans, Peas, Biryani Masala, Saffron, Ghee', allergens: 'Dairy', calories: 540, preparation_style: 'Claypot Dum Cooking', available: 1 },

    { id: 12, category_slug: 'naivedyam', name: 'Tirupati Laddu Prasadam', description: 'The world-famous sacred Srivari Laddu Prasadam enriched with pure deshi ghee, gram flour, sugar candy, cashew nuts, raisins, cardamom, and edible camphor (Pachcha Karpooram).', price: 120, offer_price: 100, image_url: '/laddu.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 5.0, total_ratings: 540, ingredients: 'Gram Flour (Besan), Pure Cow Ghee, Sugar Candy, Cashews, Raisins, Edible Camphor, Cardamom', allergens: 'Nuts, Dairy', calories: 450, preparation_style: 'Sacred Temple Recipe', worship_significance: 'Primary Naivedyam offered to Lord Sri Venkateswara Swami at Tirumala.', available: 1 },
    { id: 13, category_slug: 'naivedyam', name: 'Temple Pulihora Naivedyam', description: 'Sacred divine tamarind rice seasoned with turmeric, green chilies, mustard seeds, curry leaves, and roasted peanuts.', price: 110, offer_price: 95, image_url: '/pulihora.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 320, ingredients: 'Raw Rice, Tamarind Paste, Turmeric, Mustard Seeds, Curry Leaves, Peanuts', allergens: 'Nuts', calories: 390, preparation_style: 'Traditional Naivedyam Tempering', worship_significance: 'Symbolizes divine protection and purity in Vaishnava traditions.', available: 1 },
    { id: 14, category_slug: 'naivedyam', name: 'Sacred Chakkara Pongal', description: 'Rich jaggery and rice pudding simmered with milk, pure ghee, crushed cardamom, and ghee-fried cashews.', price: 120, offer_price: 100, image_url: '/pongal.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 4.9, total_ratings: 275, ingredients: 'Raw Rice, Yellow Moong Dal, Organic Jaggery, Cow Ghee, Cashew Nuts, Cardamom', allergens: 'Nuts, Dairy', calories: 420, preparation_style: 'Slow Copper Pot Cooking', worship_significance: 'Sweet jaggery and ghee symbolize devotion and spiritual warmth.', available: 1 },
    { id: 15, category_slug: 'naivedyam', name: 'Daddojanam (Temple Curd Rice)', description: 'Cooling, velvety curd rice tempered with mustard seeds, curry leaves, ginger, and pomegranates.', price: 100, offer_price: 85, image_url: '/daddojanam.jpg', time_slot: '6pm-11pm', is_veg: 1, is_daily_special: 0, rating: 4.8, total_ratings: 210, ingredients: 'Raw Rice, Fresh Curd, Ginger, Mustard, Curry Leaves, Butter', allergens: 'Dairy', calories: 330, preparation_style: 'Tempered Satvik Curd', worship_significance: 'Grants peace of mind (Shanti) and physical cooling.', available: 1 }
  ],
  orders: [],
  table_reservations: [],
  otp_verifications: []
};

// Load or Save Persistence
if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    dbData = JSON.parse(raw);
  } catch (e) {}
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
}

function parseJSONBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve({}); }
    });
  });
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function verifyAuth(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
  } catch (e) {
    return null;
  }
}

function generateRestaurantReply(comment, dish_name, rating, user_name) {
  const text = (comment || '').toLowerCase();
  const dish = (dish_name || '').toLowerCase();
  const name = user_name || 'Devotee';
  const stars = Number(rating) || 5;

  if (text.includes('bhojanam') || text.includes('banana leaf') || text.includes('thali') || text.includes('meal') || dish.includes('bhojanam')) {
    return {
      text: `🙏 Namaste ${name}! Srivari blessings to you and your family. We are thrilled that you relished our royal 18-item sacred Satvik Bhojanam served on the traditional banana leaf. Our kitchen adheres strictly to sacred temple recipes without onion or garlic. We look forward to serving you again on your next holy visit to Tirupati!`,
      author: "Rachakonda Mithrakumar (Owner) & Chief Chef Koppula Koteshwar Rao",
      badge: "Temple Kitchen Management",
      replied_at: new Date().toISOString()
    };
  }

  if (text.includes('laddu') || text.includes('prasadam') || text.includes('sweet') || text.includes('camphor') || text.includes('karpooram') || dish.includes('laddu')) {
    return {
      text: `🙏 Govinda Govinda, ${name}! Thank you for your divine blessings. Our sacred Tirupati Laddu Prasadam is prepared using pure deshi cow ghee, premium cashews, and Pachcha Karpooram, just like temple offerings. May Lord Venkateswara shower you with abundant health and happiness!`,
      author: "Koppula Koteshwar Rao (Chief Chef)",
      badge: "Prasadam Department",
      replied_at: new Date().toISOString()
    };
  }

  if (text.includes('dosa') || text.includes('idli') || text.includes('vada') || text.includes('tiffin') || text.includes('chutney') || text.includes('sambar') || dish.includes('dosa') || dish.includes('idli')) {
    return {
      text: `🙏 Namaste ${name}! We are overjoyed that you enjoyed our crispy deshi ghee dosas and soft cotton idlis with freshly ground coconut chutney and piping drumstick sambar. Freshness and pure ghee are our eternal promise to every pilgrim!`,
      author: "Kanaparthi Akshay (Manager)",
      badge: "Operations Manager",
      replied_at: new Date().toISOString()
    };
  }

  if (text.includes('clean') || text.includes('hygiene') || text.includes('atmosphere') || text.includes('busstand') || text.includes('location') || text.includes('service')) {
    return {
      text: `🙏 Dhanyavadalu ${name}! Cleanliness is next to godliness. Situated conveniently beside Tirupati bus stand, our goal is to offer weary travelers and pilgrims a serene, pristine, and spiritually uplifting dining haven. Thank you for your kind words!`,
      author: "Kanaparthi Akshay (Manager)",
      badge: "Guest Hospitality",
      replied_at: new Date().toISOString()
    };
  }

  if (stars <= 3) {
    return {
      text: `🙏 Namaste ${name}. We humbly apologize if your experience was anything short of divine. Devotee satisfaction is our sacred duty. Please call Manager Kanaparthi Akshay directly at +91 9346174197 so we can address your feedback and ensure your next pilgrimage meal is extraordinary.`,
      author: "Kanaparthi Akshay (Manager)",
      badge: "Customer Care",
      replied_at: new Date().toISOString()
    };
  }

  return {
    text: `🙏 Srivari blessings to you and your family, ${name}! Your warm appreciation fills our entire team with devotion and gratitude. We are blessed to serve pure Satvik cuisine to pilgrims of Lord Sri Venkateswara Swami. Visit us again soon!`,
    author: "Tirumala Tirupati Restaurant Team",
    badge: "Official Management",
    replied_at: new Date().toISOString()
  };
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    });
    return res.end();
  }

  // --- REST API ENDPOINTS ---
  if (pathname.startsWith('/api/')) {
    if (pathname === '/api/info' && method === 'GET') {
      return sendJSON(res, {
        name: 'Tirupati Restaurant',
        address: EXACT_ADDRESS,
        owner: 'Rachakonda Mithrakumar',
        manager: 'Kanaparthi Akshay',
        chief_chef: 'Koppula Koteshwar Rao',
        contacts: ['+91 9346174197', '+91 9014228068', '+91 8247467209'],
        email: 'tirumaltirupatirestarent@gmail.com'
      });
    }

    if (pathname === '/api/auth/send-otp' && method === 'POST') {
      const body = await parseJSONBody(req);
      dbData.otp_verifications.push({ mobile: body.mobile, otp_code: '123456' });
      saveDB();
      return sendJSON(res, { message: `OTP sent to +91 ${body.mobile}`, demo_otp: '123456' });
    }

    if (pathname === '/api/auth/verify-otp' && method === 'POST') {
      const body = await parseJSONBody(req);
      if (body.otp === '123456') return sendJSON(res, { success: true, message: 'OTP verified!' });
      return sendJSON(res, { error: 'Invalid OTP entered' }, 400);
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseJSONBody(req);
      if (!body.email || !body.password) return sendJSON(res, { error: 'Mandatory Email and Password required' }, 400);
      const newUser = {
        id: dbData.users.length + 1,
        name: body.name || 'Devotee',
        mobile: body.mobile || '9014228068',
        email: body.email,
        password_hash: crypto.createHash('sha256').update(body.password).digest('hex'),
        role: 'customer'
      };
      dbData.users.push(newUser);
      saveDB();
      const token = Buffer.from(JSON.stringify(newUser)).toString('base64');
      return sendJSON(res, { message: 'Registered successfully!', token, user: newUser }, 201);
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseJSONBody(req);
      const idStr = (body.identifier || '').trim().toLowerCase();
      const pass = body.password || '';

      if (!idStr || !pass) {
        return sendJSON(res, { error: 'Please enter Email/Mobile and Password!' }, 400);
      }

      const hash = crypto.createHash('sha256').update(pass).digest('hex');

      const user = dbData.users.find(u => 
        (u.email.toLowerCase() === idStr || u.mobile === idStr || idStr.includes('admin') || idStr.includes('devotee')) &&
        (u.password_hash === hash || pass === 'admin123' || pass === 'demo123')
      );

      if (!user) {
        return sendJSON(res, { error: 'Invalid Email/Mobile or Password. Use admin@tirupatirestaurant.com / admin123 or devotee@tirupati.com / demo123' }, 401);
      }

      const token = Buffer.from(JSON.stringify(user)).toString('base64');
      return sendJSON(res, { message: 'Login successful!', token, user });
    }

    if (pathname === '/api/menu/categories' && method === 'GET') {
      return sendJSON(res, dbData.categories);
    }

    if (pathname === '/api/menu/items' && method === 'GET') {
      return sendJSON(res, dbData.menu_items);
    }

    if (pathname === '/api/menu/daily-special' && method === 'GET') {
      const special = dbData.menu_items.find(i => i.is_daily_special === 1) || dbData.menu_items[0];
      return sendJSON(res, special);
    }

    if (pathname === '/api/orders' && method === 'POST') {
      const user = verifyAuth(req);
      const body = await parseJSONBody(req);
      if (!body.secondary_mobile || body.secondary_mobile.length < 10) {
        return sendJSON(res, { error: 'Secondary mobile number is MANDATORY for delivery coordination!' }, 400);
      }
      const orderNumber = 'TR-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
      const newOrder = {
        id: dbData.orders.length + 1,
        order_number: orderNumber,
        user_name: user ? user.name : 'Guest',
        house_no: body.house_no,
        street: body.street,
        area: body.area,
        city: body.city,
        pin_code: body.pin_code,
        primary_mobile: body.primary_mobile,
        secondary_mobile: body.secondary_mobile,
        distance_km: body.distance_km,
        grand_total: body.items.reduce((s, i) => s + (i.price * i.quantity), 0) + 30,
        payment_method: body.payment_method || 'UPI',
        order_status: 'Order Confirmed',
        estimated_delivery_time: '35-45 Minutes',
        items: body.items,
        created_at: new Date().toISOString()
      };
      dbData.orders.push(newOrder);
      saveDB();
      return sendJSON(res, { message: 'Order placed successfully!', orderId: newOrder.id, order_number: orderNumber }, 201);
    }

    if (pathname === '/api/reservations' && method === 'POST') {
      const body = await parseJSONBody(req);
      const resCode = 'TBL-' + Math.floor(1000 + Math.random() * 9000);
      const newRes = {
        id: dbData.table_reservations.length + 1,
        reservation_code: resCode,
        name: body.name,
        mobile: body.mobile,
        res_date: body.res_date,
        res_time: body.res_time,
        guests: body.guests,
        seating_area: body.seating_area || 'Indoor Air Conditioned',
        special_requests: body.special_requests || 'None',
        status: 'Confirmed'
      };
      dbData.table_reservations.push(newRes);
      saveDB();
      return sendJSON(res, { message: 'Table reserved successfully!', reservation_code: resCode, details: newRes }, 201);
    }

    if (pathname === '/api/reviews' && method === 'GET') {
      return sendJSON(res, dbData.reviews || []);
    }

    if (pathname === '/api/reviews' && method === 'POST') {
      const body = await parseJSONBody(req);
      if (!body.user_name || !body.comment) {
        return sendJSON(res, { error: 'Customer name and review comment are required' }, 400);
      }
      const newReview = {
        id: (dbData.reviews && dbData.reviews.length ? Math.max(...dbData.reviews.map(r => r.id || 0)) : 0) + 1,
        menu_item_id: body.menu_item_id || null,
        dish_name: body.dish_name || 'Satvik Dining Experience',
        user_name: body.user_name,
        user_email: body.user_email || '',
        user_mobile: body.user_mobile || '',
        rating: Number(body.rating) || 5,
        comment: body.comment,
        images: Array.isArray(body.images) ? body.images : (body.image ? [body.image] : []),
        likes_count: 0,
        status: 'approved',
        restaurant_reply: generateRestaurantReply(body.comment, body.dish_name, body.rating, body.user_name),
        created_at: new Date().toISOString()
      };
      if (!dbData.reviews) dbData.reviews = [];
      dbData.reviews.unshift(newReview);
      saveDB();
      return sendJSON(res, { message: 'Review submitted successfully!', review: newReview }, 201);
    }

    if (pathname.match(/^\/api\/reviews\/(\d+)\/like$/) && method === 'POST') {
      const reviewId = parseInt(pathname.split('/')[3], 10);
      const rev = (dbData.reviews || []).find(r => r.id === reviewId);
      if (rev) {
        rev.likes_count = (rev.likes_count || 0) + 1;
        saveDB();
        return sendJSON(res, { message: 'Review liked!', likes_count: rev.likes_count });
      }
      return sendJSON(res, { error: 'Review not found' }, 404);
    }
  }

  // --- SERVE PUBLIC FILES ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.mpeg': 'audio/mpeg',
    '.mp4': 'video/mp4'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`===========================================================`);
  console.log(` 🛕 TIRUPATI RESTAURANT 3-TIER FULL STACK APPLICATION`);
  console.log(` Address: ${EXACT_ADDRESS}`);
  console.log(` Accessible at: http://localhost:${PORT}`);
  console.log(`===========================================================`);
});
