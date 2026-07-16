import { Link } from "react-router-dom";
import {
  Wallet, TrendingUp, PieChart, ShieldCheck, Search,
  Filter, Sparkles, ArrowRight, UserPlus, ListChecks, BarChart3,
} from "lucide-react";
import "./Landing.css";

const FEATURES = [
  {
    icon: Wallet,
    title: "Track income & expenses",
    text: "Log every rupee in or out, tagged as income or expense, in a couple of taps.",
  },
  {
    icon: Filter,
    title: "Categorize automatically",
    text: "Food, Transport, Utilities, Education, Salary, or Others — pick a category and Spendly keeps your totals sorted.",
  },
  {
    icon: Search,
    title: "Filter & search instantly",
    text: "Narrow down by type, category, or date, or just search a description to find that one entry.",
  },
  {
    icon: PieChart,
    title: "Visual analytics",
    text: "A category breakdown chart shows you where your money actually goes, at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "OTP-verified accounts",
    text: "Every signup is verified by email OTP, and your session is secured with an httpOnly cookie — not exposed to scripts.",
  },
  {
    icon: TrendingUp,
    title: "Live balance",
    text: "Your net balance, total income, and total expense update the moment you add or edit an entry.",
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your account",
    text: "Sign up with your name, email, and password — verify with a 6-digit code we email you.",
  },
  {
    icon: ListChecks,
    title: "Log your entries",
    text: "Add expenses and income as they happen, with a category and date attached.",
  },
  {
    icon: BarChart3,
    title: "See the full picture",
    text: "Filter your history and check the analytics page to understand your spending habits.",
  },
];

// Purely public marketing page — no auth check, no session lookup.
// Just navigation links to /login and /register.
export default function Landing() {
  return (
    <div>
      <header className="landing-header">
        <div className="landing-brand">
          <span className="landing-brand-mark">
            <Wallet size={19} strokeWidth={2.3} />
          </span>
          Spendly
        </div>

        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-secondary">
            Log in
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get started free
          </Link>
        </div>
      </header>

      <section className="landing-hero">
        <div>
          <span className="landing-eyebrow">
            <Sparkles size={14} /> Simple expense tracking
          </span>
          <h1>
            Know exactly where <span>every rupee</span> goes.
          </h1>
          <p>
            Spendly is a lightweight expense tracker that logs your income and
            spending, sorts it into categories, and shows you the full picture
            with real-time stats and analytics — no spreadsheets required.
          </p>
          <div className="landing-cta-row">
            <Link to="/register" className="btn btn-primary">
              Get started free <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="btn btn-secondary">
              I already have an account
            </Link>
          </div>
          <p className="landing-trust">Free to use. Your data stays yours.</p>
        </div>

        <div className="landing-preview glass">
          <div className="preview-row">
            <strong>This month</strong>
          </div>
          <div className="preview-stat-grid">
            <div className="preview-stat up">
              <span>Total income</span>
              <strong>Rs 85,000</strong>
            </div>
            <div className="preview-stat down">
              <span>Total expense</span>
              <strong>Rs 42,300</strong>
            </div>
          </div>
          <div className="preview-line">
            <span className="dot" style={{ background: "var(--expense-red)" }} />
            <span>Grocery run</span>
            <span>- Rs 3,200</span>
          </div>
          <div className="preview-line">
            <span className="dot" style={{ background: "var(--teal)" }} />
            <span>Freelance payment</span>
            <span>+ Rs 20,000</span>
          </div>
          <div className="preview-line">
            <span className="dot" style={{ background: "var(--expense-red)" }} />
            <span>Internet bill</span>
            <span>- Rs 2,500</span>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <h2>Everything you need, nothing you don't</h2>
          <p>Built to answer one question fast: where did my money go, and where's it going?</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div className="feature-card glass-strong" key={title}>
              <div className="feature-icon">
                <Icon size={21} strokeWidth={2.1} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <h2>How it works</h2>
          <p>Three steps between you and a clear view of your finances.</p>
        </div>
        <div className="steps-row">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div className="step-card glass-strong" key={title}>
              <div className="step-number">{i + 1}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-final-cta glass">
        <h2>Ready to see where your money's going?</h2>
        <p>It takes less than a minute to set up.</p>
        <Link to="/register" className="btn btn-primary">
          Create your free account <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} Spendly. Built for people who want to
        actually know where their money went.
      </footer>
    </div>
  );
}