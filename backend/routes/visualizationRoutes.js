const express = require('express');
const router = express.Router();
const {
  getPieChart, getBarChart, getLineChart, getAreaChart,
} = require('../controllers/visualizationController');

router.get('/pie/categories', getPieChart);
router.get('/bar/sources', getBarChart);
router.get('/line/articles-over-time', getLineChart);
router.get('/area/cumulative-growth', getAreaChart);

module.exports = router;