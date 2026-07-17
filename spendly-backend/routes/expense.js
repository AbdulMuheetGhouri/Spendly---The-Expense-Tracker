const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const { isloggedin, isverified, wrapAsync, validateExpense } = require("../middlewares");

// 1. ADD EXPENSE (POST) - (GET render route removed!)
router.post("/:userId/addexpense", isloggedin, isverified, validateExpense, wrapAsync(expenseController.ExpenseAdd));

// 2. UPDATE EXPENSE (PUT) - Changed from POST to PUT for REST API standard
router.put("/:userId/editexpense/:expenseId", isloggedin, isverified, validateExpense, wrapAsync(expenseController.ExpenseUpdate));

// Backend: GET /expenses/:expenseId
router.get("/expenses/:expenseId", isloggedin, isverified, wrapAsync(expenseController.getExpenseUpdate));


// 3. DELETE SINGLE EXPENSE (DELETE) - Changed from POST to DELETE
router.delete("/:userId/deleteexpense/:expenseId", isloggedin, isverified, wrapAsync(expenseController.ExpenseDelete));

// 4. DELETE ALL EXPENSES (DELETE) - Changed from POST to DELETE
router.delete("/deleteAllExpense/:userId", isloggedin, isverified, wrapAsync(expenseController.AllExpenseDelete));

// 5. EXPENSE ANALYTICS (GET Data API)
router.get("/analytics", isloggedin, isverified, wrapAsync(expenseController.ExpenseAnalytics));

module.exports = router;
