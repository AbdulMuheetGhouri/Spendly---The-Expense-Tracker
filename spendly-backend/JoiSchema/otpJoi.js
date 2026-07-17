const Joi = require("joi");

let  otpJoiSchema = Joi.object({
    otp: Joi.string()
        .trim()
        .required()
        .length(6)
        .pattern(/^[0-9]+$/).messages({
            "string.pattern.base": "OTP must contain only numbers"
        }),
});

module.exports = otpJoiSchema;