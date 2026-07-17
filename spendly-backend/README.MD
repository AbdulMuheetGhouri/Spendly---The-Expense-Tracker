# Expense Tracker Web Application

A full-stack Expense Tracker built with Node.js, Express.js, MongoDB, and EJS. The application enables users to securely manage their income and expenses, verify their accounts through OTP-based email authentication, analyze spending patterns, and maintain complete control over their financial records.

---
    
## 🚀 Features

### Authentication & Authorization

- User Registration
- Secure Login System
- JWT Authentication
- Session Management
- Password Hashing using BCrypt
- OTP-based Email Verification
- Resend OTP Functionality
- Logout Functionality

### Expense Management

- Add Income Records
- Add Expense Records
- Edit Existing Records
- Delete Individual Records
- Delete All Records
- Search Expenses
- Filter by Category
- Filter by Transaction Type
- Filter by Date

### Analytics Dashboard

- Total Income Calculation
- Total Expense Calculation
- Current Balance Calculation
- Category-wise Expense Analytics
- Visual Charts and Statistics

### User Management

- View User Profile
- Email Verification Status
- Permanently Delete Account
- Automatic Cleanup of Related Records

### Validation & Security

- Joi Validation
- Flash Messages
- Protected Routes
- Authorization Checks
- Cookie-Based Authentication
- Error Handling Middleware
- Custom Express Error Handling

---

## 🛠 Tech Stack
### MVC FrameWork.
### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- Express Session
- BCrypt

### Validation

- Joi

### Frontend

- EJS
- HTML5
- CSS3
- JavaScript

### Utilities

- Nodemailer
- Connect Flash
- Cookie Parser
- CORS

---

## 📁 Project Structure

```bash
Expense-Tracker/
│
├── controllers/
│   ├── authController.js
│   ├── expenseController.js
│   └── userController.js
│
├── models/
│   ├── user.js
│   ├── otp.js
│   └── expenses.js
│
├── routes/
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   └── userRoutes.js
│
├── middlewares/
│   ├── auth.js
│   ├── validations.js
│   ├── wrapAsync.js
│   └── ExpressError.js
│
├── JoiSchema/
│   ├── userJoi.js
│   ├── otpJoi.js
│   └── expenseJoi.js
│
├── views/
│
├── public/
│   ├── css/
│   ├── js/
│   └── assets/
│
│
├── sendmail.helper.js
├── index.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/AbdulMuheetGhouri/Spendly--Full-Stack-Website.git

cd expense-tracker
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

SESSION_SECRET=your_session_secret

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_app_password
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

---

## 🔐 Security Features

- BCrypt Password Hashing
- JWT Authentication
- Session Protection
- Email Verification
- Joi Request Validation
- Route Authorization
- Cookie Security
- Centralized Error Handling

---

## 📊 Analytics

The analytics dashboard provides:

- Total Income
- Total Expenses
- Current Balance
- Category-wise Distribution
- Visual Expense Tracking

---

## 🧪 Validation

The application uses Joi validation schemas for:

- User Registration
- OTP Verification
- Expense Creation
- Expense Updates

---

## 📌 Future Improvements

- Monthly Reports
- Budget Planning
- Export to PDF
- Export to Excel
- Password Reset
- Multi-Currency Support
- Dark Mode
- REST API Version
- React Frontend
- Docker Deployment

---

## 👨‍💻 Author

### Abdul Muheet Ghouri

Computer Engineering Student

- Web Development
- MERN Stack
- Data Analytics
- Edge AI


LinkedIn: https://www.linkedin.com/in/abdul-muheet-ghouri/

---
