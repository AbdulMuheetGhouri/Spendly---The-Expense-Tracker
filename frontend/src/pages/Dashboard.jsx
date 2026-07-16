import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { fetchDashboard, deleteExpense, deleteAllExpenses } from "../api/expense.api";
import { CATEGORY_ICON } from "../utils/constants";
import StatCards from "../components/StatCards";
import FilterBar from "../components/FilterBar";
import ExpenseList from "../components/ExpenseList";
import ConfirmDialog from "../components/ConfirmDialog";
import Loader from "../components/Loader";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ type: "", category: "", date: "", search: "" });
  const [data, setData] = useState({ expenses: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null); // { mode: "one" | "all", expense? }
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      const res = await fetchDashboard(activeFilters);
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      setData({ expenses: res.expenses || [], stats: res.stats || {} });
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce so free-text search doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => load(filters), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, load]);

  const clearFilters = () => setFilters({ type: "", category: "", date: "", search: "" });

  const handleDeleteOne = (expense) => setPendingDelete({ mode: "one", expense });
  const handleDeleteAll = () => setPendingDelete({ mode: "all" });

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      if (pendingDelete.mode === "one") {
        setDeletingId(pendingDelete.expense._id);
        const res = await deleteExpense(user.id, pendingDelete.expense._id);
        if (!res.ok) {
          toast.error(res.message);
        } else {
          toast.success(res.message || "Entry deleted.");
          load(filters);
        }
      } else {
        const res = await deleteAllExpenses(user.id);
        if (!res.ok) {
          toast.error(res.message);
        } else {
          toast.success(res.message || "All entries deleted.");
          load(filters);
        }
      }
    } finally {
      setBusy(false);
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Hey{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋</h1>
          <p>Here's how your money's moving right now.</p>
        </div>
        <div className="dashboard-actions">
          {data.expenses.length > 0 && (
            <button className="btn btn-danger" onClick={handleDeleteAll}>
              <Trash size={16} /> Delete all
            </button>
          )}
          <button className="btn btn-primary" onClick={() => navigate("/add-expense")}>
            <PlusCircle size={17} /> Add entry
          </button>
        </div>
      </div>

      <StatCards stats={data.stats} />

      <FilterBar filters={filters} onChange={setFilters} onClear={clearFilters} />

      <div className="expense-panel glass">
        <div className="panel-head">
          <h2>Recent entries</h2>
          <span>{data.stats.filteredTotal ?? data.expenses.length} shown</span>
        </div>

        {loading ? (
          <Loader label="Fetching your entries" />
        ) : (
          <ExpenseList
            expenses={data.expenses}
            categoryIcon={CATEGORY_ICON}
            onDelete={handleDeleteOne}
            deletingId={deletingId}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title={pendingDelete?.mode === "all" ? "Delete all entries?" : "Delete this entry?"}
        message={
          pendingDelete?.mode === "all"
            ? "This permanently removes every income and expense entry you've recorded. This can't be undone."
            : "This entry will be permanently removed from your records."
        }
        confirmLabel="Delete"
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
