import { Activity, History } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard } from "../api.js";

const BAR_COLORS = {
  Low: "bg-risk-low",
  Medium: "bg-risk-medium",
  High: "bg-risk-high",
  Critical: "bg-risk-critical",
};

export default function SecurityStatusDashboard({ refreshKey }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboard().then(({ data }) => {
      if (data) setStats(data);
    });
  }, [refreshKey]);

  const counts = stats?.category_counts || { Low: 0, Medium: 0, High: 0, Critical: 0 };
  const max = Math.max(1, ...Object.values(counts));

  return (
    <div id="status" className="glass-card glass-border-glow rounded-2xl p-5 sm:p-7">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-cyan-glow" />
        <h3 className="font-display text-lg font-semibold text-white">Security Status</h3>
      </div>
      <p className="mt-1 text-sm text-slate-400">
        Local activity from this TrustShield AI instance — {stats?.total_scanned ?? 0} scans so far.
      </p>

      <div className="mt-5 space-y-3">
        {Object.entries(counts).map(([category, count]) => (
          <div key={category}>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{category}</span>
              <span>{count}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-white/5">
              <div
                className={`h-2 rounded-full ${BAR_COLORS[category]}`}
                style={{ width: `${(count / max) * 100}%`, transition: "width 0.4s ease" }}
              />
            </div>
          </div>
        ))}
      </div>

      {stats?.recent?.length > 0 && (
        <div className="mt-6">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <History className="h-3.5 w-3.5" /> Recent activity
          </p>
          <ul className="mt-2 space-y-2">
            {stats.recent.slice(0, 5).map((item, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
                <span className="truncate pr-2">{item.input_preview}</span>
                <span className={`shrink-0 font-medium ${
                  item.risk_category === "Low" ? "text-risk-low" :
                  item.risk_category === "Medium" ? "text-risk-medium" :
                  item.risk_category === "High" ? "text-risk-high" : "text-risk-critical"
                }`}>
                  {item.risk_category}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
