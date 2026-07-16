import { Wallet, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import "./StatCards.css";

export default function StatCards({ stats }) {
  const { balance = 0, TotalIncome = 0, TotalExpense = 0, totalDocs = 0 } = stats || {};

  const cards = [
    {
      key: "balance",
      label: "Net balance",
      value: formatCurrency(balance),
      icon: Wallet,
      tone: balance >= 0 ? "positive" : "negative",
    },
    {
      key: "income",
      label: "Total income",
      value: formatCurrency(TotalIncome),
      icon: TrendingUp,
      tone: "positive",
    },
    {
      key: "expense",
      label: "Total expense",
      value: formatCurrency(TotalExpense),
      icon: TrendingDown,
      tone: "negative",
    },
    {
      key: "count",
      label: "Total entries",
      value: totalDocs,
      icon: Receipt,
      tone: "neutral",
    },
  ];

  return (
    <div className="stat-grid">
      {cards.map(({ key, label, value, icon: Icon, tone }) => (
        <div key={key} className={"stat-card glass-strong tone-" + tone}>
          <div className="stat-icon">
            <Icon size={20} strokeWidth={2.2} />
          </div>
          <div>
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
