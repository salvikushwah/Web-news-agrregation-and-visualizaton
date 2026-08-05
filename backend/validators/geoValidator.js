const Joi = require('joi');

const nearbyQuerySchema = Joi.object({
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(180).required(),
  radiusKm: Joi.number().positive().max(1000).default(50),
  limit: Joi.number().integer().min(1).max(50).default(20),
});

const validateNearbyQuery = (req, res, next) => {
  const { error, value } = nearbyQuerySchema.validate(req.query);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  req.validatedQuery = value; // same Express 5 req.query-is-read-only workaround from Step 9
  next();
};

module.exports = { validateNearbyQuery };