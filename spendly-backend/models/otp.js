const mongoose  = require("mongoose");
let otpSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 180
    }
});

module.exports = mongoose.model("otp",otpSchema);