import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { fetchExpenseById, updateExpense } from "../api/expense.api";
import { toDateInputValue } from "../utils/formatters";
import ExpenseForm from "../components/ExpenseForm";
import Loader from "../components/Loader";
import "./ExpenseFormPage.css";

export default function EditExpense() {
  const { user } = useAuth();
  const { expenseId } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetchExpenseById(expenseId);
      if (!res.ok) {
        toast.error(res.message || "Couldn't load that entry.");
        navigate("/dashboard", { replace: true });
        return;
      }
      setExpense(res.expense);
      setLoading(false);
    })();
  }, [expenseId, navigate]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const res = await updateExpense(user.id, expenseId, values);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message || "Entry updated.");
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading entry" />;

  return (
    <div className="form-page-card glass">
      <h1>Edit entry</h1>
      <p>Update the details below — your history stays intact.</p>
      <ExpenseForm
        defaultValues={{
          type: expense.type,
          category: expense.category,
          description: expense.description,
          amount: expense.amount,
          date: toDateInputValue(expense.date),
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    </div>
  );
}
