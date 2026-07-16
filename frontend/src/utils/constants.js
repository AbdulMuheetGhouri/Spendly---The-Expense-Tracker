// Must mirror models/expenses.js enums exactly, or the Joi validation
// middleware (JoiSchema/expenseJoi.js) will reject the request.
export const CATEGORIES = ["Food", "Transport", "Utilities", "Education", "Salary", "Others"];

export const TYPES = ["expense", "income"];

// JoiSchema/expenseJoi.js: date must be >= 1-1-2025 and <= now
export const MIN_EXPENSE_DATE = "2025-01-01";

export const CATEGORY_ICON = {
  Food: "UtensilsCrossed",
  Transport: "Car",
  Utilities: "Plug",
  Education: "GraduationCap",
  Salary: "Wallet",
  Others: "Shapes",
};
