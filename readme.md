# Spendly – MERN Expense Tracker

![MERN](https://img.shields.io/badge/Stack-MERN-green)

## Overview
Spendly is a full-stack expense tracking application built with the MERN stack. It allows users to register, verify their email using OTP, securely authenticate, manage income and expenses, visualize spending analytics, and maintain their profile.

## Features

- User registration and login
- Email OTP verification
- Secure password hashing (bcrypt)
- Authentication using cookies/JWT (depending on backend configuration)
- Protected routes
- Add, edit, delete, and search expenses
- Income & expense tracking
- Dashboard with analytics/charts
- Category-wise filtering
- User profile management
- Form validation using Joi
- MongoDB database with Mongoose
- RESTful API
- Responsive React frontend

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Context API
- CSS / Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Joi
- bcrypt
- cookie-parser
- cors
- Nodemailer

---

## Project Structure

```text
Expense Tracker/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## Installation

### Clone

```bash
git clone <https://github.com/AbdulMuheetGhouri/Spendly--The-Expense-Tracker.git>
cd Expense Tracker
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create `.env` inside backend.

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
EMAIL=your_email
EMAIL_PASSWORD=your_email_password
CLIENT_URL=http://localhost:5173
```

Adjust names to match your implementation.

---

## Workflow

1. Register
2. Verify OTP
3. Login
4. Access dashboard
5. Manage expenses
6. View analytics
7. Update profile

---

## Main Modules

- Authentication
- OTP Verification
- Expense Management
- Dashboard Analytics
- Profile
- Validation
- Email Service

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register user |
| POST | /login | Login |
| POST | /verifyemail | Verify OTP |
| GET | /me | Current user |
| POST | /expenses | Add expense |
| PUT | /expenses/:id | Update expense |
| DELETE | /expenses/:id | Delete expense |
| GET | /expenses | List expenses |

---

## Security

- Password hashing
- Server-side validation
- Protected routes
- Environment variables
- Authentication middleware

---

## Future Improvements

- Export reports
- Budget planning
- Recurring expenses
- Dark mode
- Notifications
- Multi-currency
- Mobile app

---

## Deployment

Frontend & Backend (Togather):
- Vercel

Database:
- MongoDB Atlas

---

## Contributing

1. Fork
2. Create feature branch
3. Commit
4. Push
5. Open Pull Request


---

## Author

**Abdul Muheet Ghouri**

Computer Engineering Student (MUET)
MERN Stack Developer

---

If you found this project useful, consider giving it a ⭐ on GitHub.
