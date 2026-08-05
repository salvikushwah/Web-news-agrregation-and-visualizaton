const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const categoryRoutes = require('./routes/categoryRoutes');
const sourceRoutes = require('./routes/sourceRoutes');
const app = express();
const articleRoutes = require('./routes/articleRoutes');
const newsRoutes = require('./routes/newsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const trendingRoutes = require('./routes/trendingRoutes');
const visualizationRoutes = require('./routes/visualizationRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const readingHistoryRoutes = require('./routes/readingHistoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
// ...




// Security headers
app.use(helmet());

// Allow only our frontend to call this API, and allow cookies to be sent
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Parse incoming JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Log every request in development only
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting — max 100 requests per 15 min per IP, applied to all /api routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Simple health check — confirms the server is alive
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Temporary 404 handler — we have no routes mounted yet
// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/visualization', visualizationRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/reading-history', readingHistoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/geo', require('./routes/geoRoutes'));
// 404 handler — must come after all real routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler — must always be last
app.use(errorHandler);
module.exports = app;