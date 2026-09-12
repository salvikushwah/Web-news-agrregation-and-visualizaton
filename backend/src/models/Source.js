const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Source name is required'],
      trim: true,
    },

    apiSourceId: {
      type: String,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
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

    logo: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

sourceSchema.index({ name: 1 }, { unique: true });
sourceSchema.index({ apiSourceId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Source', sourceSchema);