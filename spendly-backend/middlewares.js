const expenseJoiSchema = require("./JoiSchema/expenseJoi");
const otpJoiSchema = require("./JoiSchema/otpJoi");
const userJoiSchema = require("./JoiSchema/userJoi");
const userModel = require("./models/user");
const otpModel = require("./models/otp");
const { transporter, otpGenerator, send_email } = require("./sendmail.helper");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            return next(err);
        });
    };
};

// 1. Expense Validation Middleware
const validateExpense = wrapAsync(async (req, res, next) => {
    let { error } = await expenseJoiSchema.validate(req.body, { stripUnknown: true });

    if (error) {
        console.log("Errors in validate expense middleware: ", error);
        console.log("Error details: ", error.details[0].type);

        if(error.details[0].type === "date.min") {
            console.log("yes");
            return res.status(400).json({
                status: false,
                message: "Invalid date. The Date must be greater then 2025-01-01."
            });
        }
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
    next();
});

// 2. OTP Validation Middleware
const validateOtp = wrapAsync(async (req, res, next) => {
    let { d1, d2, d3, d4, d5, d6 } = req.body;
    let otp = { otp: d1 + d2 + d3 + d4 + d5 + d6 };

    let { error } = otpJoiSchema.validate(otp, { stripUnknown: true });

    if (error) {
        console.log("error in validateotp: ", error);
        return res.status(400).json({
            status: false,
            message: error.details[0].message
        });
    }
    req.body.otp = otp.otp;
    return next();
});

// 3. User Validation Middleware
const validateUser = wrapAsync(async (req, res, next) => {
    let { error } = await userJoiSchema.validate(req.body, { stripUnknown: true });

    if (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
    next();
});

// Express Custom Error Class
class ExpressError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}

// 4. Email Verification Check Middleware
const isverified = wrapAsync(async (req, res, next) => {
    // req.user.user ka use kiya kyunki token decoded object hai
    let user = await userModel.findById(req.user.user);
    if (!user) {
        return res.status(404).json({ status: false, message: "User not found." });
    }

    if (!user.isVerified) {
        console.log("User not verified, sending new OTP:", user.email);

        // Purane OTP delete karke naya generate karna
        await otpModel.deleteMany({ user: user._id });
        let otp = otpGenerator();
        await send_email(user.email, otp);
        await otpModel.create({ user: user._id, otp });

        // Session remove kiya, ab direct JSON se React ko unverified status aur userId bhein
        return res.status(403).json({
            status: false,
            isVerified: false,
            message: "Please verify your email first. New OTP sent.",
            userId: user._id
        });
    }
    next();
});

// 5. Authentication (Login) Check Middleware
const isloggedin = (req, res, next) => {
    let token = req.cookies.token;
    
    if (!token || token === undefined) {
        console.log("Token not found in cookies");
        return res.status(401).json({
            status: false,
            message: "Please login first!"
        });
    }
    
    try {
        let user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "User not found or unauthorized."
            });
        }

        req.user = user; // Decoded token data (id, email) req.user me save ho gaya
        next();
    }
    catch (err) {
        console.log("JWT Verification Error:", err.message);
        return res.status(401).json({
            status: false,
            message: "Session expired, please login again."
        });
    }
};

module.exports = { ExpressError, validateExpense, validateOtp, validateUser, wrapAsync, isverified, isloggedin };
