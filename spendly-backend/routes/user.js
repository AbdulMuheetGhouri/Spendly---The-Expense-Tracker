const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { validateUser, wrapAsync, isverified, isloggedin } = require("../middlewares");

// 1. REGISTER USER (POST) - (GET render route removed!)
router.post("/register", validateUser, wrapAsync(userController.userRegister));

// 2. DELETE PROFILE (DELETE) - Changed from POST to DELETE for standard API design
router.delete("/delete/profile/:userId", isloggedin, isverified, wrapAsync(userController.userRemove));

// 3. LOGIN USER (POST) - (GET render route removed!)
router.post("/auth/login", wrapAsync(userController.userLogin));

// 4. LOGOUT USER (POST) - Clear cookie and logout
router.post("/auth/logout", userController.userLogout);

// 5. USER PROFILE DATA (GET Data API) - HTML rendering removed inside controller
router.get("/profile", isloggedin, isverified, wrapAsync(userController.userProfile));

// 6. CORE MAIN DASHBOARD (GET Data API) - Used by React to fetch expenses and stats
router.get('/dashboard', isloggedin, wrapAsync(userController.userDashboard));

// 7. CURRENT USER STATUS VALIDATOR (/me Route)
router.get("/me", isloggedin, wrapAsync(userController.me));

module.exports = router;
