import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { deleteAccount, resendVerificationForLoggedInUser } from "../api/auth.api";
import { formatDate } from "../utils/formatters";
import ConfirmDialog from "../components/ConfirmDialog";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleResendVerification = async () => {
    const res = await resendVerificationForLoggedInUser();
    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message || "Verification email sent.");
    navigate("/verify-otp", { state: { userId: user.id } });
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      const res = await deleteAccount(user.id);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      toast.success("Account deleted. Take care!");
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Your account details.</p>
        </div>
      </div>

      <div className="profile-card glass">
        <div className="profile-avatar">{initials}</div>

        <div className="profile-row">
          <span>Name</span>
          <span>{user?.name}</span>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="profile-row">
          <span>Status</span>
          <span className={"status-badge " + (user?.isVerified ? "verified" : "unverified")}>
            {user?.isVerified ? "Verified" : "Unverified"}
          </span>
        </div>
        {user?.createdAt && (
          <div className="profile-row">
            <span>Member since</span>
            <span>{formatDate(user.createdAt)}</span>
          </div>
        )}

        <div className="profile-actions">
          {!user?.isVerified && (
            <button className="btn btn-secondary" onClick={handleResendVerification}>
              Verify my email
            </button>
          )}
          <button className="btn btn-danger" onClick={() => setConfirmOpen(true)}>
            Delete account
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete your account?"
        message="This permanently deletes your account and every expense you've recorded. This can't be undone."
        confirmLabel="Delete account"
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
