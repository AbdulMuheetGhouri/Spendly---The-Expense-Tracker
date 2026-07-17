require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("connected to database successfully");
    })
    .catch((e) => {
        console.log(e);
    });

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);


