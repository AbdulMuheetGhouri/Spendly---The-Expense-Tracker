# Spendly — Frontend

React (Vite) frontend for the Spendly expense tracker, built directly against
the Express/MongoDB backend (`index.js`, `routes/`, `controllers/`, `middlewares.js`).

## Stack

- React 19 + React Router 7
- react-hook-form for all forms
- axios (withCredentials — the backend's JWT lives in an httpOnly cookie)
- react-hot-toast for success/error feedback
- recharts for the analytics chart
- lucide-react for icons
- Plain CSS with a shared token system (`src/index.css`) — sky blue / teal /
  cream glassmorphism, per-component CSS files to avoid Vite's global class
  collisions

## Setup

```bash
npm install
cp .env.example .env      # defaults to http://localhost:3000
npm run dev                # runs on http://localhost:5173
```

Your backend's `cors()` origin is hardcoded to `http://localhost:5173`, so
keep the frontend on Vite's default port (or update the backend to match).

## Backend quirks this frontend deliberately works around

- **Inconsistent success key** — some endpoints return `success`, others
  `status`. `src/api/axios.js` exports a `normalize()` helper that folds both
  into a single `ok` + `message` shape used everywhere else.
- **OTP is six separate digits** — `POST /verifyemail` expects `d1..d6`, not
  a single `otp` string (see `middlewares.js: validateOtp`). `OtpInput.jsx`
  keeps the digits as an array and `auth.api.js` splits them out on submit.
- **`userId` must travel in both the URL and body/token** — add/edit/delete
  expense routes take `:userId` in the path; the controllers cross-check it
  against the JWT's `req.user.user`. The frontend always uses the logged-in
  user's own id from `AuthContext`, never a manually-entered one.
- **`isverified` middleware auto-issues a new OTP** — hitting any
  verified-only route (add/edit/delete expense, analytics, profile, delete
  account) while unverified returns `403` with `{ isVerified: false, userId }`
  and silently emails a fresh code. `AuthEventBridge.jsx` catches this
  globally and redirects to `/verify-otp`, so no page needs to special-case it.
- **`/dashboard` doesn't require verification, expense mutations do** — an
  unverified user can view an empty dashboard but gets redirected the moment
  they try to add/edit/delete anything.
- **Expense dates are bounded server-side** — Joi requires `date >= 2025-01-01`
  and `<= now` (`JoiSchema/expenseJoi.js`). The date input mirrors that with
  `min`/`max` so invalid dates never reach the backend.
- **Categories/types are fixed enums** — `Food/Transport/Utilities/Education/
  Salary/Others` and `income/expense`, pulled from `src/utils/constants.js` so
  they stay in lockstep with `models/expenses.js`.

## Structure

```
src/
  api/            axios instance + one file per backend route group
  context/        AuthContext (session state via GET /me)
  components/     Navbar, forms, lists, dialogs — all reusable
  pages/          one file per route (Login, Register, VerifyOtp,
                   Dashboard, AddExpense, EditExpense, Analytics, Profile)
  utils/          shared constants + formatters (currency, dates)
```

## Routes

| Path                          | Auth required | Verified required |
|-------------------------------|:---:|:---:|
| `/login`, `/register`         | –   | –   |
| `/verify-otp`                 | –   | –   |
| `/dashboard`                  | ✅  | –   |
| `/add-expense`                | ✅  | ✅  |
| `/expenses/:id/edit`          | ✅  | ✅  |
| `/analytics`                  | ✅  | ✅  |
| `/profile`                    | ✅  | ✅  |
