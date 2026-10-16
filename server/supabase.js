require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tqpyykxucwndqwjnlmtz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';

let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  console.log('✅ Supabase client initialized with URL:', SUPABASE_URL);
} catch (err) {
  console.error('❌ Failed to initialize Supabase client:', err.message);
}

// 1. Health check & table verification
async function checkSupabaseStatus() {
  if (!supabase) return { connected: false, error: 'Client not initialized' };
  try {
    const { data, error } = await supabase.from('menu_items').select('id').limit(1);
    if (error) {
      return {
        connected: true,
        tables_created: false,
        message: 'Connected to Supabase project, but tables are pending creation. Run supabase_schema.sql in SQL Editor.',
        error_code: error.code
      };
    }
    return {
      connected: true,
      tables_created: true,
      message: 'Supabase connected and tables active!'
    };
  } catch (e) {
    return { connected: false, error: e.message };
  }
}

// 2. Fetch categories from Supabase (with fallback flag)
async function getCategories() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// 3. Fetch menu items from Supabase
async function getMenuItems() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('menu_items').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// 4. Fetch reviews from Supabase
async function getReviews() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data;
  } catch (e) {
    return null;
  }
}

// 5. Insert review into Supabase
async function insertReview(reviewObj) {
  if (!supabase) return null;
  try {
    const payload = {
      menu_item_id: reviewObj.menu_item_id || null,
      dish_name: reviewObj.dish_name || 'Satvik Meal',
      user_name: reviewObj.user_name,
      user_email: reviewObj.user_email || null,
      user_mobile: reviewObj.user_mobile || null,
      rating: Number(reviewObj.rating) || 5,
      comment: reviewObj.comment,
      images: reviewObj.images || [],
      likes_count: reviewObj.likes_count || 0,
      status: reviewObj.status || 'approved',
      restaurant_reply: reviewObj.restaurant_reply || null,
      created_at: reviewObj.created_at || new Date().toISOString()
    };
    const { data, error } = await supabase.from('reviews').insert([payload]).select().single();
    if (error) {
      console.warn('Supabase review insert warning (using local fallback):', error.message);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

// 6. Like review in Supabase
async function likeReview(reviewId) {
  if (!supabase) return null;
  try {
    // Increment likes_count
    const { data: current } = await supabase.from('reviews').select('likes_count').eq('id', reviewId).single();
    if (current) {
      const nextLikes = (current.likes_count || 0) + 1;
      const { data } = await supabase.from('reviews').update({ likes_count: nextLikes }).eq('id', reviewId).select().single();
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
}

// 7. Insert table reservation into Supabase
async function insertReservation(resObj) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('table_reservations').insert([resObj]).select().single();
    if (error) {
      console.warn('Supabase reservation insert warning (using local fallback):', error.message);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

// 8. Insert order into Supabase
async function insertOrder(orderObj) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('orders').insert([orderObj]).select().single();
    if (error) {
      console.warn('Supabase order insert warning (using local fallback):', error.message);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

module.exports = {
  supabase,
  SUPABASE_URL,
  SUPABASE_KEY,
  checkSupabaseStatus,
  getCategories,
  getMenuItems,
  getReviews,
  insertReview,
  likeReview,
  insertReservation,
  insertOrder
};
