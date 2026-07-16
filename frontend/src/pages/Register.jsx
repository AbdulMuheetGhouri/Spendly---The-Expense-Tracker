import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser } from "../api/auth.api";
import "./Auth.css";

// Validation ranges mirror JoiSchema/userJoi.js exactly, so a submission
// that passes here won't get bounced by the validateUser middleware.
export default function Register() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: "", email: "", password: "" } });

  const onSubmit = async ({ name, email, password }) => {
    const res = await registerUser({ name, email, password });
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Account created! Check your email for the OTP.");
    navigate("/verify-otp", { state: { userId: res.userId } });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card glass">
        <div className="auth-visual">
          <div className="auth-visual-mark">
            <Wallet size={26} strokeWidth={2.2} />
          </div>
          <h2>Start tracking in under a minute.</h2>
          <p>Create an account, verify your email, and your dashboard is ready.</p>
        </div>

        <div className="auth-form-side">
          <h1>Create your account</h1>
          <p className="auth-sub">It's free, and takes less than a minute.</p>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <div className="auth-input-wrap">
                <User size={17} strokeWidth={2} />
                <input
                  id="name"
                  type="text"
                  placeholder="Abdul Muheet"
                  {...register("name", {
                    required: "Name is required.",
                    minLength: { value: 5, message: "Name must be at least 5 characters." },
                    maxLength: { value: 20, message: "Name must be under 20 characters." },
                  })}
                />
              </div>
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>

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
                  placeholder="5 to 15 characters"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: { value: 5, message: "Password must be at least 5 characters." },
                    maxLength: { value: 15, message: "Password must be under 15 characters." },
                  })}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} tabIndex={-1}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <button className="btn btn-primary auth-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
