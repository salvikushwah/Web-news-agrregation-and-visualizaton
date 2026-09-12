const articleRepository = require('../repositories/articleRepository');
const categoryRepository = require('../repositories/categoryRepository');
const sourceRepository = require('../repositories/sourceRepository');
const AppError = require('../utils/AppError');
const searchHistoryRepository = require('../repositories/searchHistoryRepository');

const createArticle = async (data) => {
  const existing = await articleRepository.findByUrl(data.url);
  if (existing) {
    throw new AppError('An article with this URL already exists', 409);
  }

  const category = await categoryRepository.findById(data.category);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  const source = await sourceRepository.findById(data.source);
  if (!source) {
    throw new AppError('Source not found', 404);
  }

  return articleRepository.create({
    ...data,
    addedBy: 'admin',
  });
};

const getArticleById = async (id, { incrementView = false } = {}) => {
  const article = await articleRepository.findById(id);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  if (incrementView) {
    await articleRepository.incrementViews(id);
    article.views += 1;
  }

  return article;
};

const getArticles = async ({
  page = 1,
  limit = 10,
  sortBy = '-publishedAt',
  onlyApproved = true,
}) => {
  const filter = onlyApproved ? { isApproved: true } : {};

  const [articles, total] = await Promise.all([
    articleRepository.findWithFilters({
      filter,
      page: Number(page),
      limit: Number(limit),
      sortBy,
      projection: '-content',
    }),
    articleRepository.countWithFilters(filter),
  ]);

  return {
    articles,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateArticle = async (id, data) => {
  const article = await articleRepository.updateById(id, data);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  return article;
};

const approveArticle = async (id) => {
  const article = await articleRepository.updateById(id, {
    isApproved: true,
  });

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  return article;
};

const deleteArticle = async (id) => {
  const article = await articleRepository.deleteById(id);

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  return article;
};

const buildSourceFilter = async (sourceParam) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(sourceParam);

  if (isObjectId) {
    return { source: sourceParam };
  }

  const matches = await sourceRepository.findAll({
    name: new RegExp(sourceParam, 'i'),
  });

  return {
    source: {
      $in: matches.map((s) => s._id),
    },
  };
};

const searchArticles = async (params, userId = null) => {
  const {
    q,
    title,
    author,
    source,
    category,
    country,
    language,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10,
    sortBy = '-publishedAt',
  } = params;

  const filter = {
    isApproved: true,
  };

  if (title) {
    filter.title = new RegExp(title, 'i');
  }

  if (author) {
    filter.author = new RegExp(author, 'i');
  }

  if (country) {
    filter.country = country.toLowerCase();
  }

  if (language) {
    filter.language = language.toLowerCase();
  }

  if (dateFrom || dateTo) {
    filter.publishedAt = {};

    if (dateFrom) {
      filter.publishedAt.$gte = new Date(dateFrom);
    }

    if (dateTo) {
      filter.publishedAt.$lte = new Date(dateTo);
    }
  }

  if (category) {
    const categoryDoc = await categoryRepository.findBySlug(
      category.toLowerCase()
    );

    if (!categoryDoc) {
      return {
        articles: [],
        pagination: {
          total: 0,
          page: Number(page),
          limit: Number(limit),
          totalPages: 0,
        },
      };
    }

    filter.category = categoryDoc._id;
  }

  if (source) {
    Object.assign(filter, await buildSourceFilter(source));
  }

  const [articles, total] = await Promise.all([
    articleRepository.searchArticles({
      filter,
      textQuery: q,
      page: Number(page),
      limit: Number(limit),
      sortBy,
      projection: '-content',
    }),

    articleRepository.countSearchResults(filter, q),
  ]);

  if (q) {
    searchHistoryRepository
      .logSearch({
        query: q,
        user: userId,
        resultsCount: total,
      })
      .catch((err) =>
        console.error(
          'Failed to log search history:',
          err.message
        )
      );
  }

  return {
    articles,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createArticle,
  getArticleById,
  getArticles,
  updateArticle,
  approveArticle,
  deleteArticle,
  searchArticles,
};
