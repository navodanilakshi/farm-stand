const Joi = require('joi');

module.exports.productSchema = Joi.object({
	name: Joi.string().required(),
	price: Joi.number().min(0).required(),
	category: Joi.string()
});

module.exports.farmSchema = Joi.object({
	name: Joi.string().required(),
	city: Joi.string().required(),
	email: Joi.string(),
	products: Joi.array()
});
