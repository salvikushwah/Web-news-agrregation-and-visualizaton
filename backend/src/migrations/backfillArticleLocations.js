require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('../models/Article');
const countryCoordinates = require('../constants/countryCoordinates');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const articles = await Article.find({ location: { $exists: false }, country: { $exists: true, $ne: null } });

  let updated = 0;
  for (const article of articles) {
    const coords = countryCoordinates[article.country];
    if (!coords) continue;
    article.location = { type: 'Point', coordinates: coords };
    await article.save();
    updated++;
  }

  console.log(`Backfilled location on ${updated} articles.`);
  await mongoose.disconnect();
};

run();