import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Sparkles } from "lucide-react";

const CATEGORY_STYLES = {
  Low: { ring: "stroke-risk-low", text: "text-risk-low", bg: "bg-risk-low/10", border: "border-risk-low/30" },
  Medium: { ring: "stroke-risk-medium", text: "text-risk-medium", bg: "bg-risk-medium/10", border: "border-risk-medium/30" },
  High: { ring: "stroke-risk-high", text: "text-risk-high", bg: "bg-risk-high/10", border: "border-risk-high/30" },
  Critical: { ring: "stroke-risk-critical", text: "text-risk-critical", bg: "bg-risk-critical/10", border: "border-risk-critical/30" },
};

function ScoreRing({ score, category }) {
  const styles = CATEGORY_STYLES[category] || CATEGORY_STYLES.Low;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          className={styles.ring}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-2xl font-bold text-white">{score}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

export default function RiskResult({ result }) {
  if (!result) return null;
  const styles = CATEGORY_STYLES[result.risk_category] || CATEGORY_STYLES.Low;

  return (
    <div className="mt-6 space-y-5">
      <div className={`glass-card rounded-2xl border ${styles.border} p-5 sm:p-6`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <ScoreRing score={result.risk_score} category={result.risk_category} />
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles.bg} ${styles.text}`}>
              <ShieldAlert className="h-3.5 w-3.5" />
              {result.risk_category} risk
            </span>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{result.summary}</p>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="h-3.5 w-3.5" />
              Analyzer used: {result.analyzer_used === "gemini" ? "Gemini-assisted explanation" : "Rule-based engine"} ·
              Language: {result.language_detected}
            </p>
          </div>
        </div>
      </div>

      {result.signals?.length > 0 ? (
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <h4 className="font-display text-sm font-semibold text-white">Detected warning signals</h4>
          <ul className="mt-4 space-y-3">
            {result.signals.map((signal) => (
              <li key={signal.id} className="flex gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3">
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    signal.severity === "high" ? "text-risk-high" : signal.severity === "medium" ? "text-risk-medium" : "text-slate-400"
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-slate-100">{signal.category}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{signal.explanation}</p>
                  {signal.matched_text && (
                    <p className="mt-1.5 rounded bg-black/30 px-2 py-1 text-xs italic text-slate-400">
                      “{signal.matched_text}”
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="glass-card flex items-center gap-2 rounded-2xl p-4 text-sm text-slate-300">
          <CheckCircle2 className="h-4 w-4 text-risk-low" />
          No known scam-message patterns were detected in this text.
        </div>
      )}

      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <h4 className="font-display text-sm font-semibold text-white">Recommended safety actions</h4>
        <ul className="mt-3 space-y-2">
          {result.recommended_actions.map((action, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-glow" />
              {action}
            </li>
          ))}
        </ul>
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {result.disclaimer}
      </p>
    </div>
  );
}
