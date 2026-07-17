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


app.use(express.static(path.join(__dirname, "public")));

// session
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false
    })
)
const user = require("./models/user");
const console = require("console");
const expenses = require("./models/expenses");


const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const otpRoutes = require("./routes/otp");

app.use("/",userRoutes);
app.use("/",expenseRoutes);
app.use("/",otpRoutes);


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Spendly Backend API is running."
    });
});

app.listen("3000", () => {
    console.log("server is listening at port 3000");
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});