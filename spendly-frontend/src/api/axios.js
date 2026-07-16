import axios from "axios";

// Backend runs on port 3000 (hardcoded in index.js), CORS is locked to
// http://localhost:5173 with credentials, so the Vite dev server must run
// on 5173 (the default) for cookies to work.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required: JWT lives in an httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// The backend is inconsistent about which key carries the ok/fail flag
// (`success` in userController/otpController for CRUD, `status` in
// middlewares.js and a few controller methods). Normalize both into
// `ok` + `message` so the rest of the app never has to think about it.
export function normalize(data) {
  if (!data || typeof data !== "object") {
    return { ok: false, message: "Unexpected server response.", raw: data };
  }
  const ok = data.success ?? data.status ?? false;
  const message = data.message || (ok ? "Done." : "Something went wrong.");
  return { ...data, ok, message };
}

// Central place to react to auth failures. Components can still catch
// errors themselves for field-level messages.
let onUnauthorized = null;
let onUnverified = null;

export function registerAuthHandlers({ unauthorized, unverified }) {
  onUnauthorized = unauthorized;
  onUnverified = unverified;
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401 && onUnauthorized) {
      onUnauthorized(data);
    }
    if (status === 403 && data?.isVerified === false && onUnverified) {
      onUnverified(data);
    }
    return Promise.reject(error);
  }
);

// Axios throws for ANY non-2xx response (400 duplicate email, 404 not found,
// 409 conflict, etc.) — but the backend puts a perfectly good
// { success/status: false, message: "..." } body on those responses too.
// Every api/*.api.js call goes through this so that body is never lost:
// callers always get back a normalized { ok, message, ...rest } object,
// success or failure, and never need their own try/catch just to read
// the backend's error message.
export async function apiCall(promise) {
  try {
    const { data } = await promise;
    return normalize(data);
  } catch (error) {
    if (error.response?.data) {
      return normalize(error.response.data);
    }
    if (error.request) {
      return { ok: false, message: "Can't reach the server. Is the backend running?" };
    }
    return { ok: false, message: error.message || "Something went wrong." };
  }
}

export default api;
