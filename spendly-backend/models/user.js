require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(" MongoDB Connected");
    } catch (err) {
        console.error(" MongoDB Connection Error:", err);
        process.exit(1);
    }
}

connectDB();


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


