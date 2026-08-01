const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const { router: authRouter } = require('./routes/auth');
const menuRouter = require('./routes/menu');
const ordersRouter = require('./routes/orders');
const reservationsRouter = require('./routes/reservations');
const reviewsRouter = require('./routes/reviews');
const adminRouter = require('./routes/admin');

app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Healthy',
    restaurant: 'Tirupati Restaurant',
    owner: 'Rachakonda Mithrakumar',
    manager: 'Kanaparthi Akshay',
    chief_chef: 'Koppula Koteshwar Rao',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Tirupati Restaurant 3-Tier REST API Server Running `);
  console.log(` Listening on: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
