const userModel = require("../models/user");
const otpModel = require("../models/otp");
const expenseModel = require("../models/expenses");
const { ExpressError } = require("../middlewares");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { transporter, otpGenerator, send_email } = require("../sendmail.helper");

const userController = require("./user");
const expenseController = require("./expense");

// 1. OTP Verification Controller (POST) - Fully Functional
module.exports.otpVerify = async (req, res, next) => {
  try {
    let { otp, userId } = req.body;
    console.log("Verifying OTP for user:", userId);

    let otpDoc = await otpModel.findOne({ user: userId });
    let user = await userModel.findById(userId);

    if (!otpDoc) {
      return res.status(400).json({
        status: false,
        message: "OTP expired or invalid",
      });
    }

    console.log("original OTP: ", otpDoc.otp);
    if (otp == otpDoc.otp) {
      let updateduser = await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { isVerified: true } },
        { new: true },
      );
      await otpModel.findByIdAndDelete({ _id: otpDoc._id });

      let token = jwt.sign(
        { user: user._id, email: user.email },
        process.env.JWT_SECRET,
      );

      console.log("token generated successfully");
      res.cookie("token", token, {
        path: "/",
        maxAge: 432000000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(200).json({
        status: true,
        message: `Welcome ${user.name}`,
        user: {
          id: updateduser._id,
          name: updateduser.name,
          email: updateduser.email,
          isVerified: updateduser.isVerified,
        },
      });
    }

    return res.status(400).json({
      status: false,
      message: "OTP does not match",
    });
  } catch (err) {
    next(err);
  }
};

// 2. Normal OTP Resend Controller (POST) - Registration ke waqt ka resend
module.exports.otpResend = async (req, res, next) => {
  try {
    let { userId } = req.body; // Session ki jagah req.body se ID li
    console.log("Resending OTP for user ID: ", userId);

    let user = await userModel.findById(userId);
    let otpDoc = await otpModel.findOne({ user: userId });

    if (!user || !otpDoc) {
      return res
        .status(404)
        .json({ status: false, message: "OTP or user not found" });
    }

    // 1 Minute throttle check (Aapka solid logic)
    let time = otpDoc.createdAt.getTime();
    if (Date.now() - time < 60 * 1000) {
      return res.status(429).json({
        status: false,
        message: "Cannot send OTP twice in a minute. Please wait.",
      });
    }

    let otp = otpGenerator();
    await send_email(user.email, otp);

    await otpModel.findOneAndUpdate(
      { user: userId },
      { $set: { createdAt: Date.now(), otp: otp } },
    );

    return res.status(200).json({
      status: true,
      message: "New OTP has been sent to your email successfully.",
    });
  } catch (err) {
    next(err);
  }
};

// 3. Authenticated OTP Resend Controller (POST) - LoggedIn user ke liye
module.exports.AuthOtpResend = async (req, res, next) => {
  try {
    // Session ki jagah isloggedin middleware ka req.user use kiya
    let userId = req.user.user;
    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let otp = otpGenerator();
    await send_email(user.email, otp);

    await otpModel.deleteMany({ user: user._id });
    await otpModel.create({ user: user._id, otp });

    return res.status(200).json({
      status: true,
      message: "New OTP has been generated and sent to your email.",
    });
  } catch (err) {
    next(err);
  }
};
