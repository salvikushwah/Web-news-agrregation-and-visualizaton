const Joi = require('joi');

const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required(),
});

const articleIdParamSchema = Joi.object({
  articleId: Joi.string().hex().length(24).required(),
});

const commentIdParamSchema = Joi.object({
  commentId: Joi.string().hex().length(24).required(),
});

const validateCreateComment = (req, res, next) => {
  const { error } = createCommentSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

const validateArticleIdParam = (req, res, next) => {
  const { error } = articleIdParamSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: 'Invalid article ID' });
  next();
};

const validateCommentIdParam = (req, res, next) => {
  const { error } = commentIdParamSchema.validate(req.params);
  if (error) return res.status(400).json({ success: false, message: 'Invalid comment ID' });
  next();
};

module.exports = { validateCreateComment, validateArticleIdParam, validateCommentIdParam };