// Maps OUR category slugs → NewsAPI's fixed category values
// NewsAPI has no "politics" category, so we route it through "general"
module.exports = {
  technology: 'technology',
  sports: 'sports',
  business: 'business',
  politics: 'general',
  entertainment: 'entertainment',
  science: 'science',
  health: 'health',
};