const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

// A compound unique index — this is the ACTUAL enforcement of "no duplicate bookmarks,"
// not just something we check in application code
bookmarkSchema.index({ user: 1, article: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);