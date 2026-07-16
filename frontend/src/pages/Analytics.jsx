import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import { fetchAnalytics } from "../api/expense.api";
import { formatCurrency } from "../utils/formatters";
import Loader from "../components/Loader";
import "./Analytics.css";

// Palette derived from the app's own token set, cycled per category slice.
const SLICE_COLORS = ["#22819A", "#90C2E7", "#C15C5C", "#5FA1D2", "#CDD4DD", "#17606F"];

export default function Analytics() {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetchAnalytics();
      if (!res.ok) {
        toast.error(res.message);
        setLoading(false);
        return;
      }
      setLabels(res.analytics?.labels || []);
      setValues(res.analytics?.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader label="Crunching your numbers" />;

  const total = values.reduce((sum, v) => sum + v, 0);
  const chartData = labels.map((label, i) => ({ name: label, value: values[i] }));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Where your money's grouped, by category, across all entries.</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-panel glass">
          <h2>Category breakdown</h2>
          <p>Combined total per category, income and expense entries alike.</p>

          {chartData.length === 0 ? (
            <div className="analytics-empty">
              Add a few entries first — your breakdown will show up here.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="analytics-panel glass">
          <h2>By the numbers</h2>
          <p>{total > 0 ? `${formatCurrency(total)} tracked across all categories.` : "No totals yet."}</p>

          <ul className="legend-list">
            {chartData.map((c, i) => (
              <li key={c.name} className="legend-row">
                <span
                  className="legend-dot"
                  style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
                />
                <span>{c.name}</span>
                <span className="legend-value">{formatCurrency(c.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
