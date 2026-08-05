const Joi = require('joi');

const articleIdParamSchema = Joi.object({
  articleId: Joi.string().hex().length(24).required(),
});

const validateArticleIdParam = (req, res, next) => {
  const { error } = articleIdParamSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: 'Invalid article ID' });
  }
  next();
};

module.exports = { validateArticleIdParam };