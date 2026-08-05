const cron = require('node-cron');
const newsIngestionService = require('../services/newsIngestionService');

const scheduleNewsFetch = () => {
  // '0 */6 * * *' = minute 0, every 6th hour → runs at 00:00, 06:00, 12:00, 18:00
  cron.schedule('0 */6 * * *', async () => {
    console.log('[CRON] Starting scheduled news ingestion...');
    try {
      await newsIngestionService.runIngestion();
    } catch (err) {
      console.error('[CRON] News ingestion failed:', err.message);
    }
  });

  console.log('News fetch cron scheduled (every 6 hours).');
};

module.exports = scheduleNewsFetch;