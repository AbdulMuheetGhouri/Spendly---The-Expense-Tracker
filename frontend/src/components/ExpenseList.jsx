import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed, Car, Plug, GraduationCap, Wallet, Shapes, Pencil, Trash2, Inbox,
} from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import "./ExpenseList.css";

const ICONS = {
  UtensilsCrossed, Car, Plug, GraduationCap, Wallet, Shapes,
};

export default function ExpenseList({ expenses, categoryIcon, onDelete, deletingId }) {
  const navigate = useNavigate();

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-empty glass-strong">
        <Inbox size={32} strokeWidth={1.6} />
        <p>No entries match these filters yet.</p>
        <span>Add your first expense or income to see it here.</span>
      </div>
    );
  }

  return (
    <ul className="expense-list">
      {expenses.map((exp) => {
        const Icon = ICONS[categoryIcon[exp.category]] || Shapes;
        const isIncome = exp.type === "income";
        return (
          <li key={exp._id} className="expense-item glass-strong">
            <div className={"expense-icon " + (isIncome ? "income" : "expense")}>
              <Icon size={18} strokeWidth={2} />
            </div>

            <div className="expense-main">
              <p className="expense-desc">{exp.description}</p>
              <p className="expense-meta">
                {exp.category} &middot; {formatDate(exp.date)}
              </p>
            </div>

            <p className={"expense-amount " + (isIncome ? "income" : "expense")}>
              {isIncome ? "+" : "-"}
              {formatCurrency(exp.amount)}
            </p>

            <div className="expense-actions">
              <button
                type="button"
                className="icon-btn"
                title="Edit entry"
                onClick={() => navigate(`/expenses/${exp._id}/edit`)}
              >
                <Pencil size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="icon-btn danger"
                title="Delete entry"
                disabled={deletingId === exp._id}
                onClick={() => onDelete(exp)}
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
