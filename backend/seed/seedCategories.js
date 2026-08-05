require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  { name: 'Technology', description: 'Tech news and innovations' },
  { name: 'Sports', description: 'Sports news and updates' },
  { name: 'Business', description: 'Business and finance news' },
  { name: 'Politics', description: 'Political news and analysis' },
  { name: 'Entertainment', description: 'Movies, music, celebrity news' },
  { name: 'Science', description: 'Scientific discoveries and research' },
  { name: 'Health', description: 'Health and wellness news' },
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