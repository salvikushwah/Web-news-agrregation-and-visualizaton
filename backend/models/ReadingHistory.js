const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    viewCount: {
      type: Number,
      default: 1,
    },
    totalReadingTime: {
      type: Number, // stored in seconds
      default: 0,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// One history record per (user, article) pair — repeated views UPDATE this, they don't create new rows
readingHistorySchema.index({ user: 1, article: 1 }, { unique: true });

// Powers "recently viewed" — sorted by most-recently-viewed per user
readingHistorySchema.index({ user: 1, lastViewedAt: -1 });

module.exports = mongoose.model('ReadingHistory', readingHistorySchema);