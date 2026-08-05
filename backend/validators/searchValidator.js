const Joi = require('joi');

const searchQuerySchema = Joi.object({
  q: Joi.string().max(200).allow('', null),
  title: Joi.string().max(200).allow('', null),
  author: Joi.string().max(100).allow('', null),
  source: Joi.string().max(100).allow('', null),
  category: Joi.string().max(50).allow('', null),
  country: Joi.string().length(2).allow('', null),
  language: Joi.string().length(2).allow('', null),
  dateFrom: Joi.date().iso().allow('', null),
  dateTo: Joi.date().iso().allow('', null),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  sortBy: Joi.string().valid('-publishedAt', 'publishedAt', '-views', 'views').default('-publishedAt'),
});

const validateSearchQuery = (req, res, next) => {
  const { error, value } = searchQuerySchema.validate(req.query, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ success: false, message });
  }
  // Important: cannot reassign req.query directly — remember from Step 2,
  // Express 5 made req.query a read-only getter. We attach the validated,
  // defaulted values to a new property instead.
  req.validatedQuery = value;
  next();
};

module.exports = { validateSearchQuery };