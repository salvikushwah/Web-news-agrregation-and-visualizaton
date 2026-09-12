const express = require('express');
const router = express.Router();
const { getNearbyArticles } = require('../controllers/geoController');
const { validateNearbyQuery } = require('../validators/geoValidator');

router.get('/nearby', validateNearbyQuery, getNearbyArticles);

module.exports = router;