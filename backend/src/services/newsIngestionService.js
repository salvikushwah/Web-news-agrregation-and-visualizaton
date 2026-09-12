const { extractEvent } = require('./aiService');
const categoryMap = require('../constants/newsCategoryMap');
const countryCoordinates = require('../constants/countryCoordinates');

const categoryRepository = require('../repositories/categoryRepository');
const sourceRepository = require('../repositories/sourceRepository');
const articleRepository = require('../repositories/articleRepository');

const { fetchTopHeadlines } = require('./newsApiService');

const COUNTRY = process.env.NEWS_COUNTRY || 'us';
const AUTO_APPROVE =
  process.env.AUTO_APPROVE_API_ARTICLES === 'true';


// --------------------------------------------------
// Resolve or create news source
// --------------------------------------------------

const resolveSource = async (rawSource) => {
  const name = rawSource?.name || 'Unknown Source';
  const apiId = rawSource?.id || null;

  // First try API source ID
  if (apiId) {
    const existingByApiId =
      await sourceRepository.findByApiSourceId(apiId);

    if (existingByApiId) {
      return existingByApiId;
    }
  }

  // Then try source name
  const existingByName =
    await sourceRepository.findByName(name);

  if (existingByName) {
    return existingByName;
  }

  // Create safely, handling a race/duplicate
  try {
    return await sourceRepository.findOrCreate({
      name,
      apiSourceId: apiId || undefined,
    });
  } catch (err) {
    if (err.code === 11000) {
      const existing =
        await sourceRepository.findByName(name);

      if (existing) {
        return existing;
      }
    }

    throw err;
  }
};


// --------------------------------------------------
// Ingest a single article
// --------------------------------------------------

const ingestArticle = async (raw, categoryDoc) => {

  // Skip invalid NewsAPI articles
  if (
    !raw.url ||
    !raw.title ||
    raw.title === '[Removed]'
  ) {
    return {
      skipped: true,
    };
  }


  // ------------------------------------------------
  // Resolve source
  // ------------------------------------------------

  const source = await resolveSource(raw.source);


  // ------------------------------------------------
  // Extract event information using AI
  // ------------------------------------------------

  const aiResult = await extractEvent({
    title: raw.title,
    content: raw.content || raw.description || '',
  });


  console.log(
    `AI extracted event for: "${raw.title}"`
    
  );
  await new Promise(resolve => setTimeout(resolve, 5000));

  // ------------------------------------------------
  // Build article payload
  // ------------------------------------------------

  const payload = {
    title: raw.title,

    description:
      raw.description || '',

    content:
      raw.content || '',

    url:
      raw.url,

    imageUrl:
      raw.urlToImage || '',

    author:
      raw.author || 'Unknown',

    category:
      categoryDoc._id,

    source:
      source._id,

    publishedAt:
      raw.publishedAt
        ? new Date(raw.publishedAt)
        : new Date(),

    country:
      COUNTRY,

    language:
      raw.language || undefined,

    // AI-generated event information
    event:
      aiResult.event,

    summary:
      aiResult.summary,

    tags:
      aiResult.tags,

    addedBy:
      'api',

    isApproved:
      AUTO_APPROVE,

    // Existing backend geographic location
    location:
      countryCoordinates[COUNTRY]
        ? {
            type: 'Point',
            coordinates: countryCoordinates[COUNTRY],
          }
        : undefined,
  };


  // ------------------------------------------------
  // Check whether article already exists
  // ------------------------------------------------

  const existing =
    await articleRepository.findByUrl(raw.url);


  if (existing) {

    await articleRepository.updateById(
      existing._id,
      payload
    );

    return {
      updated: true,
    };
  }


  // ------------------------------------------------
  // Create new article
  // ------------------------------------------------

  await articleRepository.create(payload);

  return {
    created: true,
  };
};


// --------------------------------------------------
// Run complete news ingestion
// --------------------------------------------------

const runIngestion = async () => {

  const summary = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    firstError: null,
  };


  // ------------------------------------------------
  // Process every configured category
  // ------------------------------------------------

  for (const [slug, apiCategory] of Object.entries(categoryMap)) {

    try {

      // Find category in MongoDB
      const categoryDoc =
        await categoryRepository.findBySlug(slug);


      // Category doesn't exist
      if (!categoryDoc) {

        console.warn(
          `Skipping "${slug}" — no matching Category found.`
        );

        continue;
      }


      // ------------------------------------------------
      // Fetch articles from NewsAPI
      // ------------------------------------------------

      const rawArticles =
        (await fetchTopHeadlines({
          category: apiCategory,
          country: COUNTRY,
        })).slice(0,10);


      console.log(
        `Fetched ${rawArticles.length} articles for ${slug} (${apiCategory})`
      );


      // ------------------------------------------------
      // Process every article
      // ------------------------------------------------

      for (const raw of rawArticles) {

        try {

          const result =
            await ingestArticle(
              raw,
              categoryDoc
            );


          if (result.skipped) {

            summary.skipped++;

          } else if (result.created) {

            summary.created++;

          } else if (result.updated) {

            summary.updated++;
          }

        } catch (err) {

          summary.errors++;


          // Save the first error so the API response
          // tells us exactly what is failing.

          if (!summary.firstError) {

            summary.firstError = {
              title: raw.title,
              message: err.message,
              stack: err.stack,
            };
          }


          console.error(
            `FAILED INGEST: "${raw.title}" | ${err.message}`
          );
        }
      }

    } catch (err) {

      // Error fetching an entire category

      summary.errors++;


      if (!summary.firstError) {

        summary.firstError = {
          category: slug,
          apiCategory,
          message: err.message,
          stack: err.stack,
        };
      }


      console.error(
        `FAILED CATEGORY: "${slug}" (${apiCategory}) | ${err.message}`
      );
    }
  }


  console.log(
    'News ingestion summary:',
    summary
  );


  return summary;
};


module.exports = {
  runIngestion,
};