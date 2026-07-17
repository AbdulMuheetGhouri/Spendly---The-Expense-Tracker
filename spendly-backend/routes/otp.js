const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp");
const { validateOtp, wrapAsync, isloggedin } = require("../middlewares");

// REMOVED: GET /verifyemail (Kyunki React page render kr rha he)

// OTP Verification Route
router.post("/verifyemail", validateOtp, wrapAsync(otpController.otpVerify));

// Resend OTP for Unverified/Registering user
router.post("/resendotp", wrapAsync(otpController.otpResend));

// Resend OTP for Authenticated/Loggedin user
router.post("/auth/resend-verification", isloggedin, wrapAsync(otpController.AuthOtpResend));

module.exports = router;
