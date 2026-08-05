const categoryMap = require('../constants/newsCategoryMap');
const categoryRepository = require('../repositories/categoryRepository');
const sourceRepository = require('../repositories/sourceRepository');
const articleRepository = require('../repositories/articleRepository');
const { fetchTopHeadlines } = require('./newsApiService');

const COUNTRY = process.env.NEWS_COUNTRY || 'us';
const AUTO_APPROVE = process.env.AUTO_APPROVE_API_ARTICLES === 'true';

// Find (or create) the Source document matching NewsAPI's raw { id, name } object
const resolveSource = async (rawSource) => {
  const name = rawSource?.name || 'Unknown Source';
  const apiId = rawSource?.id || null;

  if (apiId) {
    const bySourceId = await sourceRepository.findByApiSourceId(apiId);
    if (bySourceId) return bySourceId;
  }

  const byName = await sourceRepository.findByName(name);
  if (byName) return byName;

  return sourceRepository.create({ name, apiSourceId: apiId || undefined });
};

const ingestArticle = async (raw, categoryDoc) => {
  // NewsAPI sometimes returns removed/paywalled placeholder entries — skip them
  if (!raw.url || !raw.title || raw.title === '[Removed]') {
    return { skipped: true };
  }

  const source = await resolveSource(raw.source);

  const payload = {
    title: raw.title,
    description: raw.description || '',
    content: raw.content || '',
    url: raw.url,
    imageUrl: raw.urlToImage || '',
    author: raw.author || 'Unknown',
    category: categoryDoc._id,
    source: source._id,
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : new Date(),
    country: COUNTRY,
    addedBy: 'api',
    isApproved: AUTO_APPROVE,
  };

  const existing = await articleRepository.findByUrl(raw.url);

  if (existing) {
    await articleRepository.updateById(existing._id, payload);
    return { updated: true };
  }

  await articleRepository.create(payload);
  return { created: true };
};

const runIngestion = async () => {
  const summary = { created: 0, updated: 0, skipped: 0, errors: 0 };

  for (const [slug, apiCategory] of Object.entries(categoryMap)) {
    const categoryDoc = await categoryRepository.findBySlug(slug);
    if (!categoryDoc) {
      console.warn(`Skipping "${slug}" — no matching Category found. Did you run the seed script?`);
      continue;
    }

    try {
      const rawArticles = await fetchTopHeadlines({ category: apiCategory, country: COUNTRY });

      for (const raw of rawArticles) {
        try {
          const result = await ingestArticle(raw, categoryDoc);
          if (result.skipped) summary.skipped++;
          else if (result.created) summary.created++;
          else if (result.updated) summary.updated++;
        } catch (err) {
          summary.errors++;
          console.error(`Failed to ingest "${raw.title}":`, err.message);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch category "${apiCategory}":`, err.message);
    }
  }

  console.log('News ingestion summary:', summary);
  return summary;
};

const countryCoordinates = require('../constants/countryCoordinates');
// ...
location: countryCoordinates[COUNTRY]
  ? { type: 'Point', coordinates: countryCoordinates[COUNTRY] }
  : undefined,

module.exports = { runIngestion };