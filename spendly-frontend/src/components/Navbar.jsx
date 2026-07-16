import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, PieChart, UserCircle, LogOut, Wallet } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/add-expense", label: "Add entry", icon: PlusCircle },
  { to: "/analytics", label: "Analytics", icon: PieChart },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out. See you soon!");
    navigate("/login");
  };

  return (
    <nav className="sidebar glass">
      <div className="sidebar-brand">
        <span className="brand-mark">
          <Wallet size={20} strokeWidth={2.4} />
        </span>
        <span className="brand-text">Spendly</span>
      </div>

      {user && !user.isVerified && (
        <div className="verify-pill" title="Verify your email to unlock all features">
          Unverified account
        </div>
      )}

      <ul className="sidebar-links">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={18} strokeWidth={2} />
        <span>Log out</span>
      </button>
    </nav>
  );
}
