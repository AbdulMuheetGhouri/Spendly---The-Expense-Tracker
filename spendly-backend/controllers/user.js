// const userModel = require("../models/user");
// const otpModel = require("../models/otp");
// const expenseModel = require("../models/expenses");
// const { ExpressError } = require("../middlewares");


// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const { transporter, otpGenerator, send_email } = require("../sendmail.helper");


// const expenseController = require("./expense");
// const otpController = require("./otp");

// module.exports.userRegister = async (req, res, next) => {
//     let { name, email, password } = req.body;

//     let user = await userModel.findOne({ email });
//     if (user) {

//         return res.status(400).json({
//             success: false,
//             message: "User Already Registered with this email."
//         });
//     }

//     // bcyrpt password:
//     let salt = await bcrypt.genSalt(10);
//     let hash = await bcrypt.hash(password, salt);

//     user = await userModel.create({
//         name, email,
//         password: hash
//     });

//     let otp = otpGenerator();
//     await send_email(email, otp);
//     await otpModel.create({ user: user._id, otp });

//     req.session.pendingUser = user._id;
//     req.session.save((err) => {
//         if (err) {
//             return next(new ExpressError(500, err));
//         }

//         return res.status(201).json({
//             success: true,
//             message: "User Registered Successfully..",
//             userId: user._id,
//             redirect: "/verifyemail"
//         });
//     })
// };
// module.exports.userRemove = (async (req, res, next) => {

//     let userId = req.params.userId;
//     if (!userId) throw new ExpressError(404, "user id not found.");

//     let user = await userModel.findById(userId);
//     if (!user) throw new ExpressError(404, "user not found.");

//     if (user._id.toString() !== req.session.LoggedinUser.user.toString()) {
//         throw new ExpressError(403, "Unauthorized");
//     }


//     await otpModel.deleteMany({ user: user._id });
//     await expenseModel.deleteMany({ user: userId });
//     await userModel.findByIdAndDelete(userId);

//     req.session.destroy(() => {
//         res.clearCookie("token", {
//             httpOnly: true,
//         });

//         return res.redirect("/register");
//     })
// });


// module.exports.userLogout = (req, res, next) => {

//     req.session.destroy(() => {

//         res.clearCookie("token", {
//             httpOnly: true,
//         });
//         return res.redirect("/auth/login");
//     });
// };


// module.exports.userLogin = (async (req, res) => {
//     let { email, password } = req.body;
//     if (!email || !password) {
//         req.flash("error", "Please Fill the fields");
//         return res.redirect("/auth/login");
//     }

//     let user = await userModel.findOne({ email });
//     if (!user) {
//         req.flash("error", "No User registerd with this email");
//         return res.redirect("/auth/login");
//     }
//     let result = await bcrypt.compare(password, user.password);
//     if (!result) {
//         req.flash("error", ("Incorrect Email or Password."));
//         return res.redirect("/auth/login");
//     }

//     req.session.LoggedinUser = user;
//     let token = await jwt.sign({ user: user._id, email: user.email }, process.env.JWT_SECRET);
//     res.cookie("token", token, { httpOnly: true, maxAge: 432000000 });

//     req.session.save((err) => {
//         if (err) {
//             throw new ExpressError(500, err.message);
//         }
//         req.flash("success", `Welcome back ${user.name}`);
//         return res.redirect(req.session.redirectURL || "/dashboard");
//     })
// });
// // backend/routes/auth.js
// module.exports.me = async (req, res) => {
//     try {
//         // req.user humein upar wale middleware se mil gaya (jisme user ki ID hai)
//         let user = await userModel.findById(req.user.user).select("-password");

//         return res.status(200).json({
//             status: true,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });
//     } catch (err) {
//         return res.status(500).json({ status: false, message: "Server Error" });
//     }
// };



// module.exports.userProfile = (async (req, res) => {

//     let user = await userModel.findById(req.session.LoggedinUser.user);
//     res.render("users/profile", { user });

// })
// module.exports.userDashboard = (async (req, res) => {

//     // let user = await userModel.findById(req.session.LoggedinUser.user);
//     let userId = req.user.user;

//     let query = { user: req.userId };

//     if (req.query.type) {
//         query.type = req.query.type
//     }
//     if (req.query.category) {
//         query.category = req.query.category
//     }
//     if (req.query.date) {
//         query.date = req.query.date
//     }
//     if (req.query.search) {
//         query.description = {
//             $regex: req.query.search,
//             $options: "i"
//         }
//     }

//     let balance = 0, TotalExpense = 0, TotalIncome = 0;
//     expenses = await expenseModel.find(query);
//     expenses.forEach(expense => {
//         if (expense.type === "income") {
//              TotalIncome += expense.amount;
//         }
//         if (expense.type === "expense") {
//              TotalExpense += expense.amount;
//         }
//     });
//     balance = TotalIncome - TotalExpense;

//     let totalDocs = await expenseModel.countDocuments({ user: userId });

//     return res.status(200).json({
//         success: true,
//         expenses,
//         stats: {
//             balance, TotalExpense, TotalIncome, filteredTotal: expenses.length,
//             totalDocs
//         }
//     });

// });


const userModel = require("../models/user");
const otpModel = require("../models/otp");
const expenseModel = require("../models/expenses");
const { ExpressError } = require("../middlewares");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { transporter, otpGenerator, send_email } = require("../sendmail.helper");

const expenseController = require("./expense");
const otpController = require("./otp");

// 1. User Registration Controller (POST)
module.exports.userRegister = async (req, res, next) => {
    try {
        let { name, email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User Already Registered with this email."
            });
        }

        // bcrypt password:
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password, salt);

        user = await userModel.create({
            name,
            email,
            password: hash
        });

        let otp = otpGenerator();
        await send_email(email, otp);
        await otpModel.create({ user: user._id, otp });

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully. Please verify your OTP.",
            userId: user._id
        });
    } catch (err) {
        next(err);
    }
};

// 2. User Account Remove Controller (DELETE/POST)
module.exports.userRemove = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        if (!userId) return res.status(400).json({ success: false, message: "User ID not found." });

        let user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        // Token user se validation (Security)
        if (user._id.toString() !== req.user.user.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized action." });
        }

        await otpModel.deleteMany({ user: user._id });
        await expenseModel.deleteMany({ user: userId });
        await userModel.findByIdAndDelete(userId);

        // Session destroy hatakar simple cookie clear aur JSON response
        res.clearCookie("token", { httpOnly: true, path: "/" });
        return res.status(200).json({
            success: true,
            message: "User account and all related data deleted successfully."
        });
    } catch (err) {
        next(err);
    }
};

// 3. User Logout Controller (POST)
module.exports.userLogout = (req, res, next) => {
    // Session dependency completely removed
    res.clearCookie("token", { httpOnly: true, path: "/" });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully."
    });
};

// 4. User Login Controller (POST)
module.exports.userLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "No User registered with this email" });
        }

        let result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(400).json({ success: false, message: "Incorrect Email or Password." });
        }

        // JWT token and cookie setup
        let token = jwt.sign({ user: user._id, email: user.email }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true, maxAge: 432000000, path: "/" });

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified // ✨ FIX: Login response me bhi add kar diya
            }
        });

    } catch (err) {
        next(err);
    }
};

module.exports.me = async (req, res) => {
    try {
        let user = await userModel.findById(req.user.user).select("-password");
        if (!user) return res.status(404).json({ status: false, message: "User not found" });

        return res.status(200).json({
            status: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: "Server Error" });
    }
};


// 6. User Profile Data Controller (GET)
module.exports.userProfile = async (req, res, next) => {
    try {
        let user = await userModel.findById(req.user.user).select("-password");
        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified // ✨ FIX: Profile API me bhi add kiya
            }
        });
    } catch (err) {
        next(err);
    }
};


// 7. Core Main Dashboard Controller (GET API for React rendering)
module.exports.userDashboard = async (req, res, next) => {
    try {
        const userId = req.user.user;

        // FIX: Variable parameter matching corrected
        let query = { user: userId };

        if (req.query.type) query.type = req.query.type;
        if (req.query.category) query.category = req.query.category;
        if (req.query.date) query.date = req.query.date;
        if (req.query.search) {
            query.description = {
                $regex: req.query.search,
                $options: "i"
            };
        }

        let balance = 0, TotalExpense = 0, TotalIncome = 0;

        // FIX: 'expenses' variable properly declared and queried
        let expenses = await expenseModel.find(query);

        expenses.forEach(expense => {
            if (expense.type === "income") {
                TotalIncome += expense.amount;
            }
            if (expense.type === "expense") {
                TotalExpense += expense.amount;
            }
        });
        balance = TotalIncome - TotalExpense;

        let totalDocs = await expenseModel.countDocuments({ user: userId });

        return res.status(200).json({
            success: true,
            expenses,
            stats: {
                balance,
                TotalExpense,
                TotalIncome,
                filteredTotal: expenses.length,
                totalDocs
            }
        });
    } catch (err) {
        next(err);
    }
};
