const Joi = require('joi');

module.exports.productSchema = Joi.object({
	name: Joi.string().required(),
	price: Joi.number().min(0).required(),
	category: Joi.string()
});
