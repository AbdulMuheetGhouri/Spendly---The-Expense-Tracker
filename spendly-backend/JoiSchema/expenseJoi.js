const joi = require("joi");

let expenseJoiSchema = joi.object({

    description: joi.string().required(),
    amount: joi.number().positive().required(),
    category: joi.string().required().valid("Food", "Transport", "Utilities", "Education", "Salary", "Others"),
    type: joi.string().required().valid("income", "expense"),
    date: joi.date().required().min('1-1-2025').max('now'),
});
module.exports =  expenseJoiSchema ;

