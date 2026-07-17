require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongooseConnection = require("./models/user");
const expressSession = require("express-session");
const userModel = require("./models/user");
const { transporter, otpGenerator, send_email } = require("./sendmail.helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpModel = require("./models/otp");
const expenseModel = require("./models/expenses");
const {validateUser,validateExpense,validateOtp,isverified,wrapAsync,ExpressError,isloggedin} = require("./middlewares");
const userController = require("./controllers/user");
const expenseController = require("./controllers/expense");
const otpController = require("./controllers/otp");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:5173","https://spendly-frontend-eight.vercel.app"],
    credentials: true
}));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false
    })
)
const flash = require("connect-flash");
const user = require("./models/user");
const console = require("console");
const expenses = require("./models/expenses");
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const otpRoutes = require("./routes/otp");

app.use("/",userRoutes);
app.use("/",expenseRoutes);
app.use("/",otpRoutes);


app.get("/",(req,res)=>{res.render("index")});

app.listen("3000", () => {
    console.log("server is listening at port 3000");
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occured" } = err;
    console.error(err);

    // If the client expects JSON (API call), return JSON instead of redirecting
    const accept = req.headers && req.headers.accept ? req.headers.accept : '';
    if (accept.includes('application/json') || req.xhr) {
        return res.status(status).json({ success: false, message });
    }

    if (typeof req.flash === 'function') {
        req.flash("error", message);
        return res.status(status).redirect(req.get("Referrer") || "/dashboard");
    }

    return res.status(status).send(message);
});