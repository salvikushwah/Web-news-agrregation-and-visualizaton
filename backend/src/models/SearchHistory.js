const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = guest/anonymous search
    },
    resultsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

searchHistorySchema.index({ query: 1 });
searchHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);