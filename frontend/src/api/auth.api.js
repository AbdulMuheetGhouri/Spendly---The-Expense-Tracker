import api, { apiCall } from "./axios";

// POST /register  -> { success, message, userId }
// On duplicate email the backend responds 400 with { success:false, message }
// — apiCall() catches that and returns it normalized, same as a 2xx reply.
export function registerUser({ name, email, password }) {
  return apiCall(api.post("/register", { name, email, password }));
}

// POST /verifyemail  body: { d1..d6, userId } -> middleware joins digits into otp
// -> { status, message, user }
export function verifyOtp({ digits, userId }) {
  const [d1, d2, d3, d4, d5, d6] = digits;
  return apiCall(api.post("/verifyemail", { d1, d2, d3, d4, d5, d6, userId }));
}

// POST /resendotp  body: { userId } -- pre-login resend, throttled 1/min
export function resendOtp({ userId }) {
  return apiCall(api.post("/resendotp", { userId }));
}

// POST /auth/resend-verification -- for an already logged-in but unverified user
export function resendVerificationForLoggedInUser() {
  return apiCall(api.post("/auth/resend-verification"));
}

// POST /auth/login -> { success, message, user }
export function loginUser({ email, password }) {
  return apiCall(api.post("/auth/login", { email, password }));
}

// POST /auth/logout
export function logoutUser() {
  return apiCall(api.post("/auth/logout"));
}

// GET /me -> { status, user }
export function fetchMe() {
  return apiCall(api.get("/me"));
}

// GET /profile -> { success, user }
export function fetchProfile() {
  return apiCall(api.get("/profile"));
}

// DELETE /delete/profile/:userId
export function deleteAccount(userId) {
  return apiCall(api.delete(`/delete/profile/${userId}`));
}
