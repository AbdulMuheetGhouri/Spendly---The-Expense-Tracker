import api, { apiCall } from "./axios";

// GET /dashboard?type=&category=&date=&search= -> { success, expenses, stats }
export function fetchDashboard(filters = {}) {
  const params = {};
  if (filters.type) params.type = filters.type;
  if (filters.category) params.category = filters.category;
  if (filters.date) params.date = filters.date;
  if (filters.search) params.search = filters.search;

  return apiCall(api.get("/dashboard", { params }));
}

// POST /:userId/addexpense -> { status, message, expense }
// Backend validates via JoiSchema/expenseJoi.js — a bad category/date/amount
// comes back as a 400 with a message, now correctly surfaced by apiCall().
export function addExpense(userId, payload) {
  return apiCall(api.post(`/${userId}/addexpense`, { userId, ...payload }));
}

// GET /expenses/:expenseId -> { status, expense }
export function fetchExpenseById(expenseId) {
  return apiCall(api.get(`/expenses/${expenseId}`));
}

// PUT /:userId/editexpense/:expenseId -> { status, message, expense }
export function updateExpense(userId, expenseId, payload) {
  return apiCall(api.put(`/${userId}/editexpense/${expenseId}`, payload));
}

// DELETE /:userId/deleteexpense/:expenseId -> { success, message }
export function deleteExpense(userId, expenseId) {
  return apiCall(api.delete(`/${userId}/deleteexpense/${expenseId}`));
}

// DELETE /deleteAllExpense/:userId -> { success, message }
export function deleteAllExpenses(userId) {
  return apiCall(api.delete(`/deleteAllExpense/${userId}`));
}

// GET /analytics -> { success, analytics: { labels, data } }
export function fetchAnalytics() {
  return apiCall(api.get("/analytics"));
}
