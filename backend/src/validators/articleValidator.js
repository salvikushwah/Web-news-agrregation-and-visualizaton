const Joi = require('joi');

const createArticleSchema = Joi.object({
  title: Joi.string().max(300).required(),
  description: Joi.string().max(500).allow('', null),
  content: Joi.string().allow('', null),
  url: Joi.string().uri().required(),
  imageUrl: Joi.string().uri().allow('', null),
  author: Joi.string().allow('', null),
  category: Joi.string().hex().length(24).required(),
  source: Joi.string().hex().length(24).required(),
  publishedAt: Joi.date().required(),
  country: Joi.string().allow('', null),
  language: Joi.string().allow('', null),
});

const updateArticleSchema = createArticleSchema.fork(
  Object.keys(createArticleSchema.describe().keys),
  (field) => field.optional()
);

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ success: false, message });
  }
  next();
};

module.exports = {
  validateCreateArticle: validate(createArticleSchema),
  validateUpdateArticle: validate(updateArticleSchema),
};