const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema(
  {
    // name: {
    //   type: String,
    //   required: [true, 'Source name is required'],
    //   trim: true,
    //   unique: true,
    // },
    // The 'id' field NewsAPI/GNews uses internally (e.g. "bbc-news")
    // This is how we'll detect duplicates when fetching from the API later
    // apiSourceId: {
    //   type: String,
    //   trim: true,
    //   unique: true,
    //   sparse: true, // allows multiple docs with no apiSourceId without violating uniqueness
    // },
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

sourceSchema.index({ name: 1 });
sourceSchema.index({ apiSourceId: 1 });

module.exports = mongoose.model('Source', sourceSchema);