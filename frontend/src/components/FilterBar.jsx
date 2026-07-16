import { Search, X } from "lucide-react";
import { CATEGORIES } from "../utils/constants";
import "./FilterBar.css";

// Mirrors userController.userDashboard's supported query params exactly:
// type, category, date (exact match, not a range), search (regex on description).
export default function FilterBar({ filters, onChange, onClear }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="filter-bar glass-strong">
      <div className="filter-search">
        <Search size={16} strokeWidth={2} />
        <input
          type="text"
          placeholder="Search description..."
          value={filters.search || ""}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      <select value={filters.type || ""} onChange={(e) => update("type", e.target.value)}>
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select value={filters.category || ""} onChange={(e) => update("category", e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.date || ""}
        onChange={(e) => update("date", e.target.value)}
      />

      {hasActiveFilters && (
        <button type="button" className="filter-clear" onClick={onClear}>
          <X size={15} /> Clear
        </button>
      )}
    </div>
  );
}
