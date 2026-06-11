require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const bannersRouter = require('./routes/banners');
const homeContentRouter = require('./routes/homeContent');

const app = express();

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      // If ALLOWED_ORIGINS is empty, allow all origins (safer default for first deployment).
      if (allowedOrigins.length === 0) {
        callback(null, true);
        return;
      }

      // allow requests with no origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/home-content', homeContentRouter);

// Root route
app.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'Backend is running',
    health: '/api/health',
  });
});

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  if (allowedOrigins.length > 0) {
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  } else {
    console.log('CORS allowed origins: * (ALLOWED_ORIGINS not set)');
  }
});
