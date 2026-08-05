const articleRepository = require('../repositories/articleRepository');

const getNearbyArticles = ({ lat, lng, radiusKm, limit }) =>
  articleRepository.findNearby({ latitude: lat, longitude: lng, radiusKm, limit });

module.exports = { getNearbyArticles };
