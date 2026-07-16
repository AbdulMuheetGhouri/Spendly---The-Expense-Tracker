import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { addExpense } from "../api/expense.api";
import ExpenseForm from "../components/ExpenseForm";
import "./ExpenseFormPage.css";

export default function AddExpense() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await addExpense(user.id, values);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message || "Entry added.");
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page-card glass">
      <h1>Add a new entry</h1>
      <p>Log an expense or income so your dashboard stays accurate.</p>
      <ExpenseForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Add entry" />
    </div>
  );
}
