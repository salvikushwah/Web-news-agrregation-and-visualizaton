const Joi = require('joi');

const articleIdParamSchema = Joi.object({
  articleId: Joi.string().hex().length(24).required(),
});

const durationBodySchema = Joi.object({
  seconds: Joi.number().positive().required(),
});

const validateArticleIdParam = (req, res, next) => {
  const { error } = articleIdParamSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: 'Invalid article ID' });
  next();
};

const validateDurationBody = (req, res, next) => {
  const { error } = durationBodySchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

module.exports = { validateArticleIdParam, validateDurationBody };