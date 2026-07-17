const mongoose = require("mongoose");
let expensesSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    category: {
        type: String,
        enum: ["Food","Transport","Utilities","Education","Salary","Others"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ["income","expense"],
        required: true
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("expense",expensesSchema);