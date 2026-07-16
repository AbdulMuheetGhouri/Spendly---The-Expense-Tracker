import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async ({ email, password }) => {
    const res = await login(email, password);
    if (!res.ok) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message || `Welcome back, ${res.user?.name || ""}!`);

    if (!res.user?.isVerified) {
      navigate("/verify-otp", { state: { userId: res.user.id } });
      return;
    }
    navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card glass">
        <div className="auth-visual">
          <div className="auth-visual-mark">
            <Wallet size={26} strokeWidth={2.2} />
          </div>
          <h2>Every rupee, accounted for.</h2>
          <p>
            Log in to see where your money went this month, and where you'd
            rather it went instead.
          </p>
        </div>

        <div className="auth-form-side">
          <h1>Welcome back</h1>
          <p className="auth-sub">Log in to your Spendly account.</p>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrap">
                <Mail size={17} strokeWidth={2} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", { required: "Email is required." })}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={17} strokeWidth={2} />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Your password"
                  {...register("password", { required: "Password is required." })}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} tabIndex={-1}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <button className="btn btn-primary auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            New to Spendly? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
