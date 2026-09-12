require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  { name: 'Technology', slug: 'technology', description: 'Tech news and innovations' },
  { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
  { name: 'Business', slug: 'business', description: 'Business and finance news' },
  { name: 'Politics', slug: 'politics', description: 'Political news and analysis' },
  { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, celebrity news' },
  { name: 'Science', slug: 'science', description: 'Scientific discoveries and research' },
  { name: 'Health', slug: 'health', description: 'Health and wellness news' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const cat of categories) {
    await Category.findOneAndUpdate(
      { name: cat.name },
      cat,
      { upsert: true, new: true, runValidators: true }
    );
  }

  console.log(`Seeded ${categories.length} categories.`);
  await mongoose.disconnect();
};

seed();