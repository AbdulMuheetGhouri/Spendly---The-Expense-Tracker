import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import OtpInput from "../components/OtpInput";
import { useAuth } from "../context/AuthContext";
import { verifyOtp, resendOtp, resendVerificationForLoggedInUser } from "../api/auth.api";
import "./Auth.css";

const RESEND_COOLDOWN = 60; // seconds — mirrors the 1-minute throttle in otpController.otpResend

export default function VerifyOtp() {
  const { user, setVerifiedUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId || user?.id || null;

  const [digits, setDigits] = useState(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      toast.error("We couldn't find your account. Please register or log in again.");
      navigate("/register", { replace: true });
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (digits.some((d) => d === "")) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await verifyOtp({ digits, userId });
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      setVerifiedUser(res.user);
      toast.success(res.message || "Email verified!");
      navigate("/dashboard", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      const res = user
        ? await resendVerificationForLoggedInUser()
        : await resendOtp({ userId });

      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message || "New OTP sent to your email.");
      setCooldown(RESEND_COOLDOWN);
    } catch {
      toast.error("Could not resend OTP right now.");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card glass">
        <div className="auth-visual">
          <div className="auth-visual-mark">
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>
          <h2>One more step.</h2>
          <p>We sent a 6-digit code to your email. It keeps your expense data yours alone.</p>
        </div>

        <div className="auth-form-side">
          <h1>Verify your email</h1>
          <p className="auth-otp-hint">
            Enter the 6-digit code we emailed you. It expires in a few minutes, so grab it fresh.
          </p>

          <form className="auth-form" onSubmit={handleVerify} noValidate>
            <OtpInput digits={digits} onChange={setDigits} />

            <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Verifying..." : "Verify email"}
            </button>
          </form>

          <button className="auth-resend" onClick={handleResend} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get a code? Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
