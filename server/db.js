const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      dob TEXT,
      gender TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. OTP Verification Table
  db.run(`
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      expires_at DATETIME NOT NULL
    )
  `);

  // 3. Categories Table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT
    )
  `);

  // 4. Menu Items Table
  db.run(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      offer_price REAL,
      image_url TEXT NOT NULL,
      is_veg INTEGER DEFAULT 1,
      is_daily_special INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.8,
      total_ratings INTEGER DEFAULT 145,
      ingredients TEXT,
      allergens TEXT,
      calories INTEGER,
      preparation_style TEXT,
      worship_significance TEXT,
      available INTEGER DEFAULT 1
    )
  `);

  // 5. Reviews Table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      menu_item_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      image_url TEXT,
      likes_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'approved',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Orders Table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      house_no TEXT NOT NULL,
      street TEXT NOT NULL,
      area TEXT NOT NULL,
      city TEXT NOT NULL,
      pin_code TEXT NOT NULL,
      landmark TEXT,
      primary_mobile TEXT NOT NULL,
      secondary_mobile TEXT NOT NULL,
      delivery_instructions TEXT,
      distance_km REAL NOT NULL,
      item_total REAL NOT NULL,
      tax_amount REAL NOT NULL,
      delivery_fee REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      grand_total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT DEFAULT 'Completed',
      order_status TEXT DEFAULT 'Order Confirmed',
      estimated_delivery_time TEXT NOT NULL,
      items_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. Table Reservations Table
  db.run(`
    CREATE TABLE IF NOT EXISTS table_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_code TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      user_mobile TEXT NOT NULL,
      res_date TEXT NOT NULL,
      res_time TEXT NOT NULL,
      guests INTEGER NOT NULL,
      seating_preference TEXT DEFAULT 'Indoor',
      special_occasion TEXT,
      status TEXT DEFAULT 'Confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 8. Customer Feedback Table
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      food_quality INTEGER,
      taste INTEGER,
      hygiene INTEGER,
      delivery INTEGER,
      service INTEGER,
      overall INTEGER,
      comments TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 9. Coupons Table
  db.run(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_percent INTEGER NOT NULL,
      max_discount REAL NOT NULL,
      min_order REAL NOT NULL,
      active INTEGER DEFAULT 1
    )
  `);

  // Seed Admin User if not exists
  const adminPassHash = bcrypt.hashSync('admin123', 10);
  db.run(`
    INSERT OR IGNORE INTO users (name, mobile, email, password_hash, role)
    VALUES ('Admin Manager', '9346174197', 'admin@tirupatirestaurant.com', '${adminPassHash}', 'admin')
  `);

  // Seed Categories if empty
  db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
    if (row && row.count === 0) {
      const categories = [
        { name: 'Breakfast', slug: 'breakfast', description: 'Traditional South Indian morning delights prepared with pure ghee and homemade chutneys.' },
        { name: 'Lunch & Meals', slug: 'lunch', description: 'Royal Satvik meals and aromatic spice rice preparations served with authentic recipes.' },
        { name: 'Worship Offerings (Naivedyam)', slug: 'naivedyam', description: 'Sacred food preparations dedicated to Lord Sri Venkateswara with deep spiritual reverence.' },
        { name: 'Snacks', slug: 'snacks', description: 'Crispy, freshly fried tea-time treats and authentic savory bites.' },
        { name: 'Desserts', slug: 'desserts', description: 'Traditional ghee sweets, fragrant halwas, and Tirupati Prasadam treats.' },
        { name: 'Drinks', slug: 'drinks', description: 'Cooling herbal beverages, fresh juices, badam milk, and authentic South Indian Filter Coffee.' }
      ];

      const stmt = db.prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
      categories.forEach(c => stmt.run(c.name, c.slug, c.description));
      stmt.finalize();

      seedMenuItems();
      seedCoupons();
    }
  });
});

function seedMenuItems() {
  const items = [
    // --- BREAKFAST ---
    {
      category_slug: 'breakfast',
      name: 'Idli',
      description: 'Steamed fluffy rice and lentil cakes served with authentic coconut chutney, tomato chutney, and piping hot sambar.',
      price: 60, offer_price: 50,
      image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Urad Dal, Fenugreek, Salt',
      allergens: 'None', calories: 180, preparation_style: 'Traditional Steaming',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Ghee Idli',
      description: 'Soft steamed idlis drenched in generous aromatic pure cow ghee and sprinkled with podi (gunpowder spice).',
      price: 90, offer_price: 80,
      image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Urad Dal, Pure Cow Ghee, Gunpowder Podi',
      allergens: 'Dairy', calories: 280, preparation_style: 'Steamed and Ghee Soaked',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Mini Idli',
      description: 'Button mini idlis floating in a bowl of hot aromatic Tirupati special sambar topped with pure ghee.',
      price: 100, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Mini Steamed Idlis, Drumstick Sambar, Ghee',
      allergens: 'Dairy', calories: 240, preparation_style: 'Sambar Dunked Mini Cakes',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Vada',
      description: 'Golden crispy lentil donuts seasoned with black pepper, ginger, and curry leaves.',
      price: 70, offer_price: 60,
      image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Urad Dal, Black Pepper, Ginger, Curry Leaves',
      allergens: 'None', calories: 290, preparation_style: 'Deep Fried Lentil Fritter',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Medu Vada',
      description: 'Classic crunchy Medu Vada served with fresh green coconut chutney and aromatic drumstick sambar.',
      price: 80, offer_price: 70,
      image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Urad Dal, Green Chilies, Cumin, Pepper',
      allergens: 'None', calories: 310, preparation_style: 'Crispy Fried Ring',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Pongal',
      description: 'Comforting savory rice and moong dal porridge tempered with ghee, cumin, black pepper, and roasted cashews.',
      price: 90, offer_price: 80,
      image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Raw Rice, Moong Dal, Pure Ghee, Cashews, Pepper, Cumin',
      allergens: 'Nuts, Dairy', calories: 350, preparation_style: 'Slow Cooked Satvik Pot',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Ven Pongal',
      description: 'Traditional temple style Ven Pongal made with pure ghee and crushed black pepper, served with coconut chutney.',
      price: 100, offer_price: 90,
      image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Raw Rice, Yellow Moong Dal, Ghee, Cashews, Ginger',
      allergens: 'Nuts, Dairy', calories: 360, preparation_style: 'Tempered Temple Recipe',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Plain Dosa',
      description: 'Thin, golden crisp fermented rice crepes served with sambar and trio of traditional chutneys.',
      price: 80, offer_price: 70,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice Batter, Urad Dal, Salt',
      allergens: 'None', calories: 210, preparation_style: 'Gridiron Rolled Crepe',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Masala Dosa',
      description: 'Crispy golden crepe stuffed with aromatic spiced potato and onion masala, cooked on tawa.',
      price: 110, offer_price: 99,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice Crepe, Spiced Potato filling, Mustard seeds, Turmeric',
      allergens: 'None', calories: 380, preparation_style: 'Crispy Griddled Crepe',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Mysore Masala Dosa',
      description: 'Signature crispy dosa lined with fiery garlic-red chili paste and filled with tempered potato masala.',
      price: 130, offer_price: 115,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Dosa Batter, Spicy Red Chutney, Potato Masala, Butter',
      allergens: 'Dairy', calories: 430, preparation_style: 'Spiced Tawa Roast',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Ghee Roast',
      description: 'Super thin paper crisp dosa roasted extravagantly in pure deshi ghee until golden perfection.',
      price: 140, offer_price: 125,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Fermented Rice Batter, Pure Desi Ghee',
      allergens: 'Dairy', calories: 420, preparation_style: 'Golden Ghee Roast',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Rava Dosa',
      description: 'Lacy, crispy golden semolina pancake infused with black pepper, cumin seeds, and finely chopped green chilies.',
      price: 120, offer_price: 105,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Semolina, Rice Flour, Cumin, Pepper, Green Chili',
      allergens: 'Gluten', calories: 340, preparation_style: 'Open Lacy Cast Iron Roast',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Onion Dosa',
      description: 'Crispy dosa topped generously with sweet caramelized shallots and chopped fresh coriander.',
      price: 115, offer_price: 100,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice Crepe, Chopped Onions, Coriander, Ghee',
      allergens: 'Dairy', calories: 330, preparation_style: 'Tawa Roasted Onions',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Set Dosa',
      description: 'Trio of soft, sponge-like fluffy dosas served with creamy vegetable kurma and coconut chutney.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Poha, Curd, Vegetable Gravy',
      allergens: 'Dairy', calories: 360, preparation_style: 'Soft Spongy Griddled Pancakes',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Uttapam',
      description: 'Thick savory rice pancake topped with fresh tomatoes, onions, green chilies, and coriander.',
      price: 115, offer_price: 100,
      image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Thick Dosa Batter, Onion, Tomato, Coriander',
      allergens: 'None', calories: 320, preparation_style: 'Thick Pan Roasted Pancake',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Poori',
      description: 'Piping hot deep fried puffed wheat bread served with spiced potato bhaji and onion coconut salad.',
      price: 95, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Whole Wheat Flour, Potato Gravy, Spices',
      allergens: 'Gluten', calories: 410, preparation_style: 'Puffed Deep Fried Bread',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Chapati',
      description: 'Soft whole wheat flatbread served with seasonal mixed vegetable curry and dal fry.',
      price: 80, offer_price: 70,
      image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Atta (Whole Wheat Flour), Vegetable Curry',
      allergens: 'Gluten', calories: 260, preparation_style: 'Tawa Roasted Flatbread',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Upma',
      description: 'Traditional roasted semolina dish cooked with mustard seeds, curry leaves, roasted cashews, and veggies.',
      price: 70, offer_price: 60,
      image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Roasted Rava, Mustard, Curry Leaves, Cashews, Carrots',
      allergens: 'Gluten, Nuts', calories: 250, preparation_style: 'Steamed Semolina Hash',
      worship_significance: null
    },
    {
      category_slug: 'breakfast',
      name: 'Kesari Bath',
      description: 'Melt-in-mouth saffron infused semolina sweet pudding loaded with pure ghee, cashews, and raisins.',
      price: 80, offer_price: 70,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Semolina, Saffron, Sugar, Ghee, Cashews, Raisins',
      allergens: 'Gluten, Nuts, Dairy', calories: 340, preparation_style: 'Saffron Ghee Pudding',
      worship_significance: null
    },

    // --- LUNCH & MEALS ---
    {
      category_slug: 'lunch',
      name: 'Mini Meals',
      description: 'Sambar rice, curd rice, sweet dish, papad, and pickle on a neat traditional platter.',
      price: 140, offer_price: 120,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Steamed Rice, Sambar, Curd, Chutney, Papad',
      allergens: 'Dairy', calories: 520, preparation_style: 'Platter Thali',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'South Indian Meals',
      description: 'Authentic South Indian Bhojanam with steamed rice, drumstick sambar, rasam, kootu, poriyal, curd, ghee, papad, and sweet.',
      price: 180, offer_price: 160,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Steamed Rice, Sambar, Rasam, Poriyal, Avial, Curd, Ghee',
      allergens: 'Dairy', calories: 750, preparation_style: 'Banana Leaf Style Bhojanam',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Deluxe Meals',
      description: 'Lavish meals including Paneer butter masala, Chapati, Special Rice, Sambar, Rasam, Curd, Payasam, and Sweet Pan.',
      price: 240, offer_price: 215,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Special Rice, Chapati, Paneer Curry, Sambar, Rasam, Sweet',
      allergens: 'Dairy, Gluten', calories: 890, preparation_style: 'Royal Deluxe Feast',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Special Meals',
      description: 'Chef Koteshwar Rao special lunch combo featuring Andhra Podi rice, Veg Fry, Gutti Vankaya curry, and Payasam.',
      price: 220, offer_price: 195,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Gutti Vankaya, Podi Ghee, Sambar, Rasam, Dessert',
      allergens: 'Dairy', calories: 820, preparation_style: 'Andhra Spice Special',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Executive Meals',
      description: 'Quick balanced office meal with Pulihora, Curd Rice, Chapati, Veg Kurma, Salad, and Gulab Jamun.',
      price: 200, offer_price: 180,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Pulihora, Curd Rice, Roti, Veg Kurma, Gulab Jamun',
      allergens: 'Dairy, Gluten', calories: 710, preparation_style: 'Executive Combo Box',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Andhra Meals',
      description: 'Spicy authentic Andhra Bhojanam served with Gunpowder Podi, Nethi Ghee, Majjiga Pulusu, Vepudu, Gongura Pachadi.',
      price: 210, offer_price: 190,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Gongura Chutney, Podi, Ghee, Fry, Majjiga Pulusu',
      allergens: 'Dairy', calories: 780, preparation_style: 'Traditional Andhra Style',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Srivari Maha Bhojanam',
      description: 'The ultimate royal temple feast served on a giant banana leaf with 18 sacred Satvik items and Tirupati Laddu.',
      price: 320, offer_price: 280,
      image_url: '/bhojanam.jpg',
      ingredients: 'Pulihora, Chakkara Pongal, Sambar Rice, Daddojanam, Laddu, Vada, Curry, Rasam, Payasam, Ghee',
      allergens: 'Dairy, Nuts', calories: 1100, preparation_style: 'Grand Satvik Banana Leaf Banquet',
      worship_significance: 'Prepared following strict Tirumala temple Satvik culinary traditions without onion or garlic.'
    },
    {
      category_slug: 'lunch',
      name: 'Tirupati Special Meals',
      description: 'Traditional pilgrimage meal with Pulihora, Sambar Rice, Curd Rice, Medu Vada, and authentic Tirupati Laddu.',
      price: 250, offer_price: 220,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Pulihora, Curd Rice, Sambar Rice, Laddu, Vada',
      allergens: 'Dairy, Nuts', calories: 860, preparation_style: 'Temple Prasadam Combination',
      worship_significance: 'Recreates the divine prasadam experience of Lord Venkateswara temple.'
    },
    {
      category_slug: 'lunch',
      name: 'Satvik Meals',
      description: 'Pure onion-free, garlic-free divine meal prepared with fresh vegetables, rock salt, and pure cow ghee.',
      price: 190, offer_price: 170,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Steamed Rice, Satvik Sambar, Pepper Rasam, Curd, Ghee',
      allergens: 'Dairy', calories: 680, preparation_style: 'Pure Satvik No-Onion No-Garlic',
      worship_significance: 'Ideal for devotees keeping fasts and seeking pure spiritual food.'
    },
    {
      category_slug: 'lunch',
      name: 'Pulihora',
      description: 'Tangy tamarind rice seasoned with mustard, green chilies, curry leaves, and crunchy roasted peanuts.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Tamarind Extract, Peanuts, Mustard, Turmeric',
      allergens: 'Nuts', calories: 410, preparation_style: 'Tempered Tamarind Rice',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Vegetable Biryani',
      description: 'Long grain basmati rice slow cooked with garden fresh vegetables, saffron, and aromatic biryani spices in a handi.',
      price: 180, offer_price: 160,
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Basmati Rice, Carrots, Beans, Peas, Biryani Masala, Saffron',
      allergens: 'Dairy', calories: 540, preparation_style: 'Claypot Dum Cooking',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Paneer Biryani',
      description: 'Fragrant Dum Biryani studded with golden marinated cottage cheese cubes and fresh mint leaves.',
      price: 210, offer_price: 190,
      image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Paneer Cubes, Basmati Rice, Mint, Saffron, Ghee',
      allergens: 'Dairy', calories: 620, preparation_style: 'Slow Dum Hyderabadi Veg Style',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Curd Rice',
      description: 'Cooling creamy yogurt rice tempered with mustard seeds, curry leaves, ginger, pomegranate, and grapes.',
      price: 95, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Steamed Rice, Fresh Yogurt, Milk, Mustard, Pomegranate',
      allergens: 'Dairy', calories: 340, preparation_style: 'Tempered Creamy Curd Rice',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Bisibele Bath',
      description: 'Karnataka special spicy rice, lentil, and vegetable mash cooked with aromatic bisibele spices and cow ghee.',
      price: 130, offer_price: 115,
      image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Toor Dal, Mixed Vegetables, Bisibele Spice, Ghee',
      allergens: 'Dairy', calories: 470, preparation_style: 'Traditional Hot Rice Lentil Mash',
      worship_significance: null
    },
    {
      category_slug: 'lunch',
      name: 'Special Festival Meals',
      description: 'Festival feast including Pulihora, Sweet Pongal, Garelu, Sambar Rice, and special Payasam.',
      price: 260, offer_price: 230,
      image_url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Pulihora, Sweet Pongal, Vada, Kootu, Rice, Sambar, Payasam',
      allergens: 'Dairy, Nuts', calories: 920, preparation_style: 'Festive Temple Platter',
      worship_significance: 'Special preparation offered during major temple festivals.'
    },

    // --- WORSHIP OFFERINGS (NAIVEDYAM) ---
    {
      category_slug: 'naivedyam',
      name: 'Tirupati Laddu',
      description: 'The world-famous sacred Srivari Laddu Prasadam enriched with pure deshi ghee, gram flour, sugar candy, cashew nuts, raisins, cardamom, and edible camphor (Pachcha Karpooram).',
      price: 120, offer_price: 100,
      image_url: '/laddu.jpg',
      ingredients: 'Gram Flour (Besan), Pure Cow Ghee, Sugar Candy, Cashews, Raisins, Edible Camphor, Cardamom',
      allergens: 'Nuts, Dairy', calories: 450, preparation_style: 'Sacred Temple Recipe',
      worship_significance: 'Primary Naivedyam offered to Lord Sri Venkateswara Swami at Tirumala. It brings divine blessings, harmony, and spiritual bliss to those who partake.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Pulihora',
      description: 'Sacred divine tamarind rice seasoned with turmeric, green chilies, mustard seeds, curry leaves, and roasted peanuts.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Raw Rice, Tamarind Paste, Turmeric, Mustard Seeds, Curry Leaves, Peanuts',
      allergens: 'Nuts', calories: 390, preparation_style: 'Traditional Naivedyam Tempering',
      worship_significance: 'Symbolizes the preservation of health and wisdom; tamarind and turmeric represent divine protection and purity in Vaishnava traditions.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Chakkara Pongal',
      description: 'Rich jaggery and rice pudding simmered with milk, pure ghee, crushed cardamom, and ghee-fried cashews.',
      price: 120, offer_price: 100,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Raw Rice, Yellow Moong Dal, Organic Jaggery, Cow Ghee, Cashew Nuts, Cardamom',
      allergens: 'Nuts, Dairy', calories: 420, preparation_style: 'Slow Copper Pot Cooking',
      worship_significance: 'Offered to Lord Vishnu during morning poojas. Sweet jaggery and ghee symbolize devotion, sweet speech, and spiritual warmth.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Sweet Pongal',
      description: 'Temple sweet pongal cooked with jaggery, cardamom, and abundant golden ghee cashews.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Dal, Jaggery, Ghee, Cashews',
      allergens: 'Nuts, Dairy', calories: 400, preparation_style: 'Traditional Brass Pot',
      worship_significance: 'Represents gratitude for harvest and divine prosperity.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Curd Rice (Daddojanam)',
      description: 'Cooling, velvety curd rice tempered with mustard seeds, curry leaves, ginger, and pomegranates.',
      price: 100, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Fresh Curd, Ginger, Mustard, Curry Leaves, Butter',
      allergens: 'Dairy', calories: 330, preparation_style: 'Tempered Satvik Curd',
      worship_significance: 'Offered as the final offering in daily temple rituals to grant peace of mind (Shanti) and physical cooling.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Ven Pongal',
      description: 'Savory rice and moong dal porridge seasoned with pepper, cumin, ginger, and ghee.',
      price: 100, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rice, Moong Dal, Ghee, Black Pepper, Cumin',
      allergens: 'Nuts, Dairy', calories: 360, preparation_style: 'Satvik Ghee Pot',
      worship_significance: 'Classic morning Naivedyam granting vitality, digestion strength, and spiritual clarity.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Kesari',
      description: 'Golden saffron semolina halwa cooked in pure cow ghee with cashews and raisins.',
      price: 90, offer_price: 80,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Rava, Saffron, Sugar, Ghee, Cashews',
      allergens: 'Gluten, Nuts, Dairy', calories: 350, preparation_style: 'Ghee Saffron Roast',
      worship_significance: 'Symbolizes auspiciousness and joyful devotion to the Divine Mother and Lord Vishnu.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Boorelu',
      description: 'Traditional Andhra sweet dumpling stuffed with sweet chana dal & jaggery paste, deep fried in rice-urad batter.',
      price: 100, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Chana Dal, Jaggery, Rice Batter, Cardamom, Ghee',
      allergens: 'Dairy', calories: 380, preparation_style: 'Golden Deep Fritter',
      worship_significance: 'Sacred festival offering prepared during Ugadi and Navaratri for family prosperity.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Appam',
      description: 'Sweet whole wheat and banana fritters flavored with cardamom and jaggery.',
      price: 90, offer_price: 75,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Wheat Flour, Ripe Bananas, Jaggery, Cardamom, Ghee',
      allergens: 'Gluten, Dairy', calories: 290, preparation_style: 'Tawa Pan Fritters',
      worship_significance: 'Favorite offering of Lord Ganesha and Lord Vishnu for removing obstacles.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Panakam',
      description: 'Rejuvenating divine beverage made with pure jaggery water, black pepper, cardamom, and dry ginger.',
      price: 60, offer_price: 50,
      image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Jaggery Water, Black Pepper, Dry Ginger, Cardamom, Lemon juice',
      allergens: 'None', calories: 120, preparation_style: 'Hand Chilled Herbal Drink',
      worship_significance: 'Offered on Sri Rama Navami and temple brahmotsavams as a divine elixir that purifies body and soul.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Butter & Misri (Makhan)',
      description: 'Fresh churned white butter served with rock sugar (Misri) and tulsi leaf.',
      price: 70, offer_price: 60,
      image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Fresh White Cow Butter, Rock Sugar Candy, Holy Tulsi',
      allergens: 'Dairy', calories: 260, preparation_style: 'Fresh Churned',
      worship_significance: 'Beloved Naivedyam of Lord Krishna and Lord Vishnu representing childlike pure devotion.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Fresh Temple Fruits Platter',
      description: 'Selection of fresh sacred fruits including banana, apple, pomegranate seeds, and tender coconut pieces.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Bananas, Apples, Pomegranate, Grapes, Coconut',
      allergens: 'None', calories: 180, preparation_style: 'Fresh Cut Offerings',
      worship_significance: 'Phala Naivedyam offered to express unconditional devotion and surrender to the supreme lord.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Dry Fruits & Nuts Offering',
      description: 'Premium cashews, raisins, almonds, pistachios, and dried dates blessed with cardamom.',
      price: 160, offer_price: 140,
      image_url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Cashew, Almonds, Pistachio, Raisins, Dried Dates',
      allergens: 'Nuts', calories: 480, preparation_style: 'Selected Nut Mix',
      worship_significance: 'Represents royal wealth, vitality, and spiritual strength.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Bellam Pongali',
      description: 'Traditional temple rice cooked with jaggery syrup and cardamom in pure cow ghee.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Raw Rice, Jaggery Syrup, Cardamom, Ghee',
      allergens: 'Dairy, Nuts', calories: 390, preparation_style: 'Traditional Clay Pot',
      worship_significance: 'Symbolizes sweetness of life, gratitude, and divine grace.'
    },
    {
      category_slug: 'naivedyam',
      name: 'Payasam',
      description: 'Velvety milk kheer cooked with rice, saffron, cardamom, cashews, and golden raisins.',
      price: 100, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Whole Cow Milk, Basmati Rice, Sugar/Jaggery, Saffron, Nuts',
      allergens: 'Dairy, Nuts', calories: 310, preparation_style: 'Slow Milk Reduction',
      worship_significance: 'Classic sacred pudding symbolizing immortality (Amrit) and divine sweetness.'
    },

    // --- SNACKS ---
    {
      category_slug: 'snacks',
      name: 'Samosa',
      description: 'Crispy pastry triangle filled with spiced potatoes, green peas, cumin, and coriander seeds.',
      price: 40, offer_price: 35,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Wheat Pastry, Potatoes, Peas, Spices',
      allergens: 'Gluten', calories: 260, preparation_style: 'Crispy Deep Fry',
      worship_significance: null
    },
    {
      category_slug: 'snacks',
      name: 'Onion Pakoda',
      description: 'Golden crunchy fritters made with thinly sliced onions, gram flour batter, curry leaves, and green chilies.',
      price: 70, offer_price: 60,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Onions, Besan (Gram Flour), Rice Flour, Curry Leaves',
      allergens: 'None', calories: 310, preparation_style: 'Crispy Deep Fritter',
      worship_significance: null
    },
    {
      category_slug: 'snacks',
      name: 'Mirchi Bajji',
      description: 'Large Andhra green chilies stuffed with tangy tamarind spice, dipped in besan batter and fried crisp.',
      price: 75, offer_price: 65,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Green Chilies, Besan, Ajwain, Tamarind Spice',
      allergens: 'None', calories: 280, preparation_style: 'Double Fried Andhra Bajji',
      worship_significance: null
    },
    {
      category_slug: 'snacks',
      name: 'Mysore Bonda',
      description: 'Fluffy golden fried snack balls crisp outside and soft inside, served with peanut chutney.',
      price: 70, offer_price: 60,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Maida, Curd, Cumin, Coconut bits, Green chilies',
      allergens: 'Gluten, Dairy', calories: 330, preparation_style: 'Puffed Deep Fried Fritter',
      worship_significance: null
    },
    {
      category_slug: 'snacks',
      name: 'Paneer Pakoda',
      description: 'Soft cottage cheese slabs coated in seasoned spiced chickpea batter and deep fried golden.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Paneer, Besan, Chaat Masala, Chili powder',
      allergens: 'Dairy', calories: 380, preparation_style: 'Deep Fried Cottage Cheese Fritter',
      worship_significance: null
    },
    {
      category_slug: 'snacks',
      name: 'Veg Cutlet',
      description: 'Spiced vegetable patties coated with breadcrumbs and shallow fried till crispy brown.',
      price: 85, offer_price: 75,
      image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Potatoes, Peas, Carrots, Breadcrumbs, Spices',
      allergens: 'Gluten', calories: 290, preparation_style: 'Shallow Fried Patty',
      worship_significance: null
    },

    // --- DESSERTS ---
    {
      category_slug: 'desserts',
      name: 'Gulab Jamun',
      description: 'Soft melt-in-mouth milk solid dumplings fried golden and soaked in cardamom rose sugar syrup.',
      price: 70, offer_price: 60,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Khoya, Paneer, Sugar Syrup, Rose Essence, Cardamom',
      allergens: 'Dairy, Gluten', calories: 320, preparation_style: 'Syrup Soaked Dumplings',
      worship_significance: null
    },
    {
      category_slug: 'desserts',
      name: 'Rasmalai',
      description: 'Flattened soft cottage cheese discs soaked in chilled saffron and cardamom infused milk garnished with pistachios.',
      price: 110, offer_price: 95,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Paneer Chhena, Thickened Milk, Saffron, Pistachio, Almonds',
      allergens: 'Dairy, Nuts', calories: 340, preparation_style: 'Saffron Milk Dip',
      worship_significance: null
    },
    {
      category_slug: 'desserts',
      name: 'Mysore Pak',
      description: 'Melt in your mouth classic South Indian sweet made with gram flour, sugar, and generous pure desi ghee.',
      price: 90, offer_price: 80,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Gram Flour, Pure Cow Ghee, Sugar',
      allergens: 'Dairy', calories: 440, preparation_style: 'Classic Ghee Fudge',
      worship_significance: null
    },
    {
      category_slug: 'desserts',
      name: 'Jangri',
      description: 'Intricate flower-shaped urad dal fried coil soaked in saffron sugar syrup.',
      price: 80, offer_price: 70,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Urad Dal, Sugar Syrup, Saffron, Cardamom',
      allergens: 'None', calories: 360, preparation_style: 'Deep Fried Flower Coil',
      worship_significance: null
    },
    {
      category_slug: 'desserts',
      name: 'Badam Halwa',
      description: 'Rich royal sweet made with ground blanched almonds, pure cow ghee, sugar, and saffron strands.',
      price: 130, offer_price: 115,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Almonds, Pure Ghee, Sugar, Saffron, Cardamom',
      allergens: 'Nuts, Dairy', calories: 490, preparation_style: 'Almond Ghee Reduction',
      worship_significance: null
    },
    {
      category_slug: 'desserts',
      name: 'Double Ka Meetha',
      description: 'Hyderabadi style fried bread pudding soaked in cardamom condensed milk and topped with cashews.',
      price: 95, offer_price: 85,
      image_url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Bread, Condensed Milk, Ghee, Sugar, Nuts',
      allergens: 'Gluten, Dairy, Nuts', calories: 410, preparation_style: 'Ghee Fried Bread Pudding',
      worship_significance: null
    },

    // --- DRINKS ---
    {
      category_slug: 'drinks',
      name: 'Filter Coffee',
      description: 'Authentic South Indian Kumbakonam style decoction coffee brewed fresh and frothed with thick milk.',
      price: 45, offer_price: 35,
      image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Coffee Decoction (80% Coffee 20% Chicory), Whole Milk, Sugar',
      allergens: 'Dairy', calories: 120, preparation_style: 'Brass Filter Brewed',
      worship_significance: null
    },
    {
      category_slug: 'drinks',
      name: 'Buttermilk (Majjiga)',
      description: 'Cooling churned spiced buttermilk blended with green chilies, ginger, curry leaves, crushed cumin, and coriander.',
      price: 40, offer_price: 30,
      image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Curd Water, Ginger, Green Chili, Cumin, Mustard, Curry Leaves',
      allergens: 'Dairy', calories: 70, preparation_style: 'Hand Churned Spiced Drink',
      worship_significance: null
    },
    {
      category_slug: 'drinks',
      name: 'Badam Milk',
      description: 'Rich warm/chilled milk flavored with crushed almonds, cardamom, saffron strands, and pistachios.',
      price: 75, offer_price: 65,
      image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Full Cream Milk, Almond Paste, Saffron, Cardamom, Pistachio',
      allergens: 'Dairy, Nuts', calories: 230, preparation_style: 'Saffron Infused Milk',
      worship_significance: null
    },
    {
      category_slug: 'drinks',
      name: 'Tender Coconut Water',
      description: 'Pure, naturally sweet tender coconut water served chilled with tender coconut pulp.',
      price: 60, offer_price: 50,
      image_url: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=600&q=80',
      ingredients: '100% Pure Fresh Tender Coconut Water & Malai',
      allergens: 'None', calories: 45, preparation_style: 'Fresh Chilled Coconut',
      worship_significance: null
    },
    {
      category_slug: 'drinks',
      name: 'Rose Milk',
      description: 'Chilled sweet milk infused with natural fragrant damask rose syrup.',
      price: 60, offer_price: 50,
      image_url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Cold Milk, Pure Rose Syrup, Basil Seeds (Sabja)',
      allergens: 'Dairy', calories: 180, preparation_style: 'Chilled Rose Blend',
      worship_significance: null
    },
    {
      category_slug: 'drinks',
      name: 'Mango Lassi',
      description: 'Thick creamy yogurt drink whipped with sweet Alphanso mango pulp and cardamom.',
      price: 80, offer_price: 70,
      image_url: 'https://images.unsplash.com/photo-1528823872057-9c018a7a70b3?auto=format&fit=crop&w=600&q=80',
      ingredients: 'Alphonso Mango Pulp, Fresh Yogurt, Sugar, Cardamom',
      allergens: 'Dairy', calories: 260, preparation_style: 'Creamy Whip',
      worship_significance: null
    }
  ];

  // Set Daily Special item
  const dailySpecialIndex = 0; // Srivari Maha Bhojanam / Tirupati Laddu

  const stmt = db.prepare(`
    INSERT INTO menu_items (
      category_slug, name, description, price, offer_price, image_url,
      is_veg, is_daily_special, rating, total_ratings, ingredients,
      allergens, calories, preparation_style, worship_significance, available
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, 4.9, 210, ?, ?, ?, ?, ?, 1)
  `);

  items.forEach((item, index) => {
    const isSpecial = (item.name === 'Srivari Maha Bhojanam' || item.name === 'Tirupati Laddu') ? 1 : 0;
    stmt.run(
      item.category_slug,
      item.name,
      item.description,
      item.price,
      item.offer_price,
      item.image_url,
      isSpecial,
      item.ingredients,
      item.allergens,
      item.calories,
      item.preparation_style,
      item.worship_significance
    );
  });
  stmt.finalize();

  // Seed sample reviews
  const reviewStmt = db.prepare(`
    INSERT INTO reviews (menu_item_id, user_name, rating, comment, likes_count, status)
    VALUES (?, ?, ?, ?, ?, 'approved')
  `);

  reviewStmt.run(1, 'Ramesh Kumar', 5, 'Authentic Tirupati taste! The ghee idlis were divine and soft as cotton.', 18);
  reviewStmt.run(1, 'Ananya Reddy', 5, 'Felt like sitting at Tirumala. The sambar has genuine traditional spices!', 12);
  reviewStmt.run(26, 'Srinivas Rao', 5, 'The Srivari Maha Bhojanam is a royal feast! Laddu was heavenly.', 34);
  reviewStmt.run(27, 'Padma Subrahmanyam', 5, 'The Tirupati Laddu prasadam has exact temple ghee aroma and taste. Blessed experience.', 42);
  reviewStmt.finalize();
}

function seedCoupons() {
  const stmt = db.prepare("INSERT INTO coupons (code, discount_percent, max_discount, min_order) VALUES (?, ?, ?, ?)");
  stmt.run('TIRUPATI10', 10, 100, 300);
  stmt.run('MAHABHOJ20', 20, 200, 600);
  stmt.run('DIVINE50', 15, 150, 400);
  stmt.finalize();
}

module.exports = db;
