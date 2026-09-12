const cron = require('node-cron');
const articleRepository = require('../repositories/articleRepository');

const RETENTION_DAYS = Number(process.env.NEWS_RETENTION_DAYS) || 30;

const scheduleOldArticleCleanup = () => {
  // '0 3 * * *' = runs once daily at 3:00 AM
  cron.schedule('0 3 * * *', async () => {
    const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
    try {
      const result = await articleRepository.deleteOlderThan(cutoff);
      console.log(`[CRON] Deleted ${result.deletedCount} articles older than ${RETENTION_DAYS} days.`);
    } catch (err) {
      console.error('[CRON] Old article cleanup failed:', err.message);
    }
  });

  console.log(`Old article cleanup cron scheduled (retention: ${RETENTION_DAYS} days).`);
};

module.exports = scheduleOldArticleCleanup;