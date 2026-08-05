const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      unique: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Source',
      required: [true, 'Source is required'],
    },
    publishedAt: {
      type: Date,
      required: [true, 'Published date is required'],
    },
    country: {
      type: String,
      trim: true,
      lowercase: true,
    },
    language: {
      type: String,
      trim: true,
      lowercase: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: String,
      enum: ['api', 'admin'],
      default: 'admin',
    },
    location: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    default: undefined, // omit the field entirely rather than defaulting to [0,0]
  },
},
  },
  { timestamps: true }
);

// Full-text search across these fields — powers the Search module (title, keyword, author)
articleSchema.index({ title: 'text', description: 'text', content: 'text', author: 'text' });

// Compound indexes — match the exact filter+sort patterns our queries will actually use
articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ source: 1, publishedAt: -1 });
articleSchema.index({ isApproved: 1, publishedAt: -1 });
articleSchema.index({ country: 1 });
articleSchema.index({ language: 1 });
articleSchema.index({ views: -1 });
articleSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Article', articleSchema);