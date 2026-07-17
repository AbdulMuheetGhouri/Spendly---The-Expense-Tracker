// const userModel = require("../models/user");
// const otpModel = require("../models/otp");
// const expenseModel = require("../models/expenses");


// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const { transporter, otpGenerator, send_email } = require("../sendmail.helper");

// const userController = require("./user");
// const otpController = require("./otp");


// module.exports.RenderExpenseAdd = async (req, res) => {
//     let user = await userModel.findById(req.session.LoggedinUser.user);
//     res.render("expenses/AddExpense", { user });
// };
// module.exports.ExpenseAdd = (async (req, res) => {
//     // let { userId } = req.params;
//     let { userId,description, amount, category, type, date } = req.body;
    
//     console.log("req.body from addexpense: ",req.body);
//     return res.json({
//         body: req.body
//     });

//     // console.log(userId,req.session.LoggedinUser.user);
//     // // 6a33a68352174f7bbff24362
//     // console.log(userId === req.session.LoggedinUser.user.toString());

//     // if (!userId || !(userId === req.session.LoggedinUser.user.toString())) {
//     //     throw new ExpressError(403, "Unauthorized");
//     // }

//     // let CreatedExpense = await expenseModel.create({
//     //     description, amount, date, category, type,
//     //     user: req.session.LoggedinUser.user
//     // });
//     // req.flash("success", "Your expense is added successfully.");
//     // return res.redirect("/dashboard");

// });

// module.exports.RenderExpenseUpdate = (async (req, res) => {


//     let { userId, expenseId } = req.params;

//     let user = await userModel.findById(userId);
//     if (!user) throw new ExpressError(404, "user not found.");

//     let expense = await expenseModel.findById(expenseId);
//     if (!expense) throw new ExpressError(404, "expense not found");

//     if (expense.user.toString() !== req.session.LoggedinUser.user.toString()) {
//         throw new ExpressError(403, "unauthorized access");
//     }

//     return res.render("expenses/EditExpense", { user, expense });

// });

// module.exports.ExpenseUpdate = (async (req, res) => {

//     let { userId, expenseId } = req.params;

//     let user = await userModel.findById(userId);
//     if (!user) throw new ExpressError(404, "user not found.");

//     let expense = await expenseModel.findById(expenseId);
//     if (!expense) throw new ExpressError(404, "expense not found");

//     if (expense.user.toString() !== req.session.LoggedinUser.user.toString()) {
//         throw new ExpressError(403, "unauthorized access");
//     }

//     let { description, amount, category, type, date } = req.body;
//     console.log("new values: ", description, amount, category, type, date);

//     let UpdatedExpense = await expenseModel.findOneAndUpdate({ _id: expense._id }, {
//         $set: {
//             category, description, amount, type, date
//         }
//     });
//     console.log(UpdatedExpense);
//     req.flash("success", "Your Expense updated Successfully.");
//     return res.redirect("/dashboard");
// })
// module.exports.ExpenseDelete = (async (req, res) => {

//     let { userId, expenseId } = req.params;
//     let expense = await expenseModel.findById(expenseId);
//     let user = await userModel.findById(userId);

//     if (!expenseId) {
//         throw new ExpressError(500, "some error occured");
//     }

//     if (!expense) {
//         throw new ExpressError(404, "Expense Not Found.");
//     }
//     if (expense.user.toString() !== req.session.LoggedinUser.user.toString()) {
//         throw new ExpressError(403, "Unauthorized");
//     }

//     await expenseModel.findByIdAndDelete(expenseId);

//     req.flash("error", "Your Expense is removed from the list.");
//     return res.redirect("/dashboard");

// });
// module.exports.AllExpenseDelete = (async (req, res) => {

//     let userId = req.params.userId;
//     if (!userId) throw new ExpressError(404, "user id is missing");

//     let user = await userModel.findById(userId);
//     if (!user || userId.toString() != req.session.LoggedinUser.user.toString()) {
//         throw new ExpressError(403, "Access forbidden");
//     }


//     await expenseModel.deleteMany({ user: userId });
//     req.flash("error", "Your All Expenses permenantly deleted.");
//     return res.redirect("/dashboard");
// });

// module.exports.ExpenseAnalytics = (async (req, res) => {

//     let userId = req.session.LoggedinUser.user;

//     let expenses = await expenseModel.find({ user: userId });

//     // category-wise grouping
//     let categoryMap = {};

//     expenses.forEach(exp => {
//         if (!categoryMap[exp.category]) {
//             categoryMap[exp.category] = 0;
//         }
//         categoryMap[exp.category] += exp.amount;
//     });

//     let labels = Object.keys(categoryMap);
//     let data = Object.values(categoryMap);


//     res.render("expenses/analytics", { labels, data, user: await userModel.findById(userId) });
// });








const userModel = require("../models/user");
const otpModel = require("../models/otp");
const expenseModel = require("../models/expenses");
const { ExpressError } = require("../middlewares");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 1. Expense Add Controller (POST)
module.exports.ExpenseAdd = async (req, res, next) => {
    try {
        let { userId, description, amount, category, type, date } = req.body;
        
        // Validation: Check if req.user exists from isloggedin middleware
        if (!req.user || !req.user.user) {
            return res.status(401).json({ success: false, message: "Unauthorized. Please login first." });
        }

        // Authorization check: URL/Body ki ID token ki ID se match honi chahiye
        if (!userId || userId !== req.user.user.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden. Unauthorized access." });
        }

        let CreatedExpense = await expenseModel.create({
            description, 
            amount, 
            date, 
            category, 
            type,
            user: req.user.user // Middleware se mili user ID save ki
        });

        return res.status(201).json({
            status: true,
            message: "Your expense is added successfully.",
            expense: CreatedExpense
        });
    } catch (err) {
        next(err);
    }
};
module.exports.getExpenseUpdate = async (req, res) => {
    try {
        let expense = await expenseModel.findById(req.params.expenseId);
        if (!expense) return res.status(404).json({ status: false, message: "Expense not found" });
        
        return res.status(200).json({ status: true, expense });
    } catch (err) {
        return res.status(500).json({ status: false, message: "Server Error" });
    }
};

// 2. Expense Update Controller (POST/PUT)
module.exports.ExpenseUpdate = async (req, res, next) => {
    try {
        let { userId, expenseId } = req.params;
        let { description, amount, category, type, date } = req.body;

        let expense = await expenseModel.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ status: false, message: "Expense not found." });
        }

        // Security check using middleware user token
        if (expense.user.toString() !== req.user.user.toString()) {
            return res.status(403).json({ status: false, message: "Unauthorized access." });
        }

        let UpdatedExpense = await expenseModel.findOneAndUpdate(
            { _id: expenseId }, 
            { $set: { category, description, amount, type, date } },
            { new: true } // fresh updated data return karne ke liye
        );

        return res.status(200).json({
            status: true,
            message: "Your Expense updated Successfully.",
            expense: UpdatedExpense
        });
    } catch (err) {
        next(err);
    }
};

// 3. Single Expense Delete Controller (DELETE/POST)
module.exports.ExpenseDelete = async (req, res, next) => {
    try {
        let { userId, expenseId } = req.params;

        if (!expenseId) {
            return res.status(400).json({ success: false, message: "Expense ID is missing." });
        }

        let expense = await expenseModel.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense Not Found." });
        }

        // Security check using token user ID
        if (expense.user.toString() !== req.user.user.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized action." });
        }

        await expenseModel.findByIdAndDelete(expenseId);

        return res.status(200).json({
            success: true,
            message: "Your Expense is removed from the list."
        });
    } catch (err) {
        next(err);
    }
};

// 4. Delete All Expenses Controller (DELETE/POST)
module.exports.AllExpenseDelete = async (req, res, next) => {
    try {
        let userId = req.params.userId;
        
        if (!userId || userId.toString() !== req.user.user.toString()) {
            return res.status(403).json({ success: false, message: "Access forbidden. Unauthorized." });
        }

        await expenseModel.deleteMany({ user: userId });

        return res.status(200).json({
            success: true,
            message: "All your expenses have been permanently deleted."
        });
    } catch (err) {
        next(err);
    }
};

// 5. Analytics Data Controller (GET)
module.exports.ExpenseAnalytics = async (req, res, next) => {
    try {
        let userId = req.user.user;

        let expenses = await expenseModel.find({ user: userId });

        // Category-wise grouping logic (Bilkul solid hai aapka)
        let categoryMap = {};
        expenses.forEach(exp => {
            if (!categoryMap[exp.category]) {
                categoryMap[exp.category] = 0;
            }
            categoryMap[exp.category] += exp.amount;
        });

        let labels = Object.keys(categoryMap);
        let data = Object.values(categoryMap);

        // HTML render karne ki jagah charts ke liye JSON data bhej rahe hain
        return res.status(200).json({
            success: true,
            analytics: {
                labels,
                data
            }
        });
    } catch (err) {
        next(err);
    }
};
