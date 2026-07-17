const Joi = require("joi");

let userJoiSchema = Joi.object({

    name: Joi.string().required().min(5).max(20),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5).max(15),
});

module.exports = userJoiSchema;
