import { useForm } from "react-hook-form";
import { CATEGORIES, TYPES, MIN_EXPENSE_DATE } from "../utils/constants";
import { todayISO } from "../utils/formatters";
import "./ExpenseForm.css";

export default function ExpenseForm({ defaultValues, onSubmit, submitting, submitLabel = "Save entry" }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      type: "expense",
      category: "Food",
      description: "",
      amount: "",
      date: todayISO(),
    },
  });

  const type = watch("type");

  return (
    <form className="expense-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="type-toggle">
        {TYPES.map((t) => (
          <label key={t} className={"type-option " + t + (type === t ? " active" : "")}>
            <input type="radio" value={t} {...register("type", { required: true })} />
            {t === "income" ? "Income" : "Expense"}
          </label>
        ))}
      </div>

      <div className="form-row">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          placeholder="e.g. Grocery run at Al-Fatah"
          {...register("description", { required: "Description is required." })}
        />
        {errors.description && <span className="field-error">{errors.description.message}</span>}
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label htmlFor="amount">Amount (PKR)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            {...register("amount", {
              required: "Amount is required.",
              valueAsNumber: true,
              validate: (v) => (v > 0 ? true : "Amount must be greater than 0."),
            })}
          />
          {errors.amount && <span className="field-error">{errors.amount.message}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            min={MIN_EXPENSE_DATE}
            max={todayISO()}
            {...register("date", { required: "Date is required." })}
          />
          {errors.date && <span className="field-error">{errors.date.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="category">Category</label>
        <select id="category" {...register("category", { required: true })}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary submit-btn" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
