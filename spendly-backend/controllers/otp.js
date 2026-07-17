// const userModel = require("../models/user");
// const otpModel = require("../models/otp");
// const expenseModel = require("../models/expenses");

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const { transporter, otpGenerator, send_email } = require("../sendmail.helper");

// const userController = require("./user");
// const expenseController = require("./expense");


// module.exports.OtpPage = (req, res) => {
//     res.render("otp/otpPage");
// };

// module.exports.otpVerify = (async (req, res) => {

//     let { otp, userId } = req.body;
//     console.log(userId);

//     let otpDoc = await otpModel.findOne({ user: userId });
//     let user = await userModel.findById(userId);


//     if (!otpDoc) {

//         return res.json({
//             status: false,
//             message: "OTP expired or invalid",
//             redirect: "/verifyemail",
//         });
//         // req.flash("error", "OTP expired or invalid");
//         // return res.redirect("/verifyemail");
//     }
//     console.log("original OTP: ", otpDoc.otp);
//     if (otp == otpDoc.otp) {
//         let updateduser = await userModel.findOneAndUpdate(
//             { _id: userId },
//             {
//                 $set: { isVerified: true },
//             },
//             { new: true }
//         );
//         await otpModel.findByIdAndDelete({ _id: otpDoc._id });

//         let token = jwt.sign(
//             { user: user._id, email: user.email },
//             process.env.JWT_SECRET,
//         );

//         console.log("token: ", token);
//         res.cookie("token", token, {
//             path: "/",
//             maxAge: 432000000,
//             httpOnly: true,
//         });



//         return res.status(200).json({
//             status: true,
//             message: `Welcome ${user.name}`,
//             redirect: "/dashboard",
//             user: {
//                 id: updateduser._id,
//                 name: updateduser.name,
//                 email: updateduser.email,
//                 verifyStatus: updateduser.isVerified,
//             }
//         });

//         // req.flash("success", );
//         // return res.status(200).redirect("/dashboard");
//     }

//     return res.status(409).json({
//         status: false,
//         message: "OTP does not match",
//         redirect: "/verifyemail"
//     })

//     // req.flash("error", "OTP doesn not match");
//     // return res.status(409).redirect("/verifyemail");
// });

// module.exports.otpResend = (async (req, res, next) => {

//     let { userId } = req.body;
//     console.log("userid ", userId);
//     return res.json({
//         message: "otp send"
//     });
//     // let otpDoc = await otpModel.findOne({ user: req.session.pendingUser });
//     // let user = await userModel.findById(req.session.pendingUser);


//     // if (!user || !otpDoc || otpDoc === null || user === null) {
//     //     return next(new ExpressError(404, "OTP or user not found"));
//     // }
//     // let time = otpDoc.createdAt.getTime();
//     // if (otpDoc && Date.now() - time < 60 * 1000) {
//     //     req.flash("error", "cannot send otp twice in a minute");
//     //     return res.redirect("/verifyemail");
//     // }
//     // let otp = otpGenerator();
//     // await send_email(user.email, otp);

//     // await otpModel.findOneAndUpdate(
//     //     { user: req.session.pendingUser },
//     //     { $set: { createdAt: Date.now(), otp: otp } }
//     // )
//     // req.flash("success", "New OTP was Sent.");
//     // return res.redirect("/verifyemail");
// });

// module.exports.AuthOtpResend = (async (req, res) => {
//     let user = await userModel.findById(req.session.LoggedinUser.user);

//     req.session.pendingUser = user;

//     let otp = otpGenerator();
//     await send_email(user.email, otp);

//     await otpModel.deleteMany({ user: user._id });
//     await otpModel.create({ user: user._id, otp });

//     req.flash("success", "New Otp has been sent to your email.");
//     return res.redirect("/verifyemail");

// });

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
                message: "OTP expired or invalid"
            });
        }

        console.log("original OTP: ", otpDoc.otp);
        if (otp == otpDoc.otp) {
            let updateduser = await userModel.findOneAndUpdate(
                { _id: userId },
                { $set: { isVerified: true } },
                { new: true }
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
samSite: "none", secure: true
            });

            return res.status(200).json({
                status: true,
                message: `Welcome ${user.name}`,
                user: {
                    id: updateduser._id,
                    name: updateduser.name,
                    email: updateduser.email,
                    isVerified: updateduser.isVerified,
                }
            });
        }

        return res.status(400).json({
            status: false,
            message: "OTP does not match"
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
            return res.status(404).json({ status: false, message: "OTP or user not found" });
        }

        // 1 Minute throttle check (Aapka solid logic)
        let time = otpDoc.createdAt.getTime();
        if (Date.now() - time < 60 * 1000) {
            return res.status(429).json({ 
                status: false, 
                message: "Cannot send OTP twice in a minute. Please wait." 
            });
        }

        let otp = otpGenerator();
        await send_email(user.email, otp);

        await otpModel.findOneAndUpdate(
            { user: userId },
            { $set: { createdAt: Date.now(), otp: otp } }
        );

        return res.status(200).json({
            status: true,
            message: "New OTP has been sent to your email successfully."
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
            message: "New OTP has been generated and sent to your email."
        });
    } catch (err) {
        next(err);
    }
};
