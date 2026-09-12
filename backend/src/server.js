const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.set('sanitizeFilter', true);

const app = require('./app');
const connectDB = require('./config/db');
const scheduleNewsFetch = require('./jobs/newsFetchJob');
const scheduleOldArticleCleanup = require('./jobs/deleteOldArticlesJob');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );

      scheduleNewsFetch();
      scheduleOldArticleCleanup();
    });

    server.on('error', (error) => {
      console.error('Server startup error:', error);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });