import { AlertOctagon, Info, Link2, Loader2, ShieldOff } from "lucide-react";
import { useState } from "react";
import { checkUrl } from "../api.js";

const LEVEL_STYLES = {
  Low: "text-risk-low bg-risk-low/10 border-risk-low/30",
  Medium: "text-risk-medium bg-risk-medium/10 border-risk-medium/30",
  High: "text-risk-high bg-risk-high/10 border-risk-high/30",
  Critical: "text-risk-critical bg-risk-critical/10 border-risk-critical/30",
};

export default function URLInspector({ onChecked }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheck() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await checkUrl(url);
    setLoading(false);
    if (apiError) {
      setError(apiError);
      setResult(null);
      return;
    }
    setResult(data);
    onChecked?.();
  }

  return (
    <div id="url-inspector" className="glass-card glass-border-glow rounded-2xl p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-glow/15">
          <Link2 className="h-5 w-5 text-violet-glow" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-white">Suspicious URL Inspector</h3>
          <p className="text-sm text-slate-400">
            Checks the link's text for structural phishing patterns. The URL is never opened.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="paste a URL, e.g. http://paytm-kyc-verify.xyz/login"
          className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-glow/50 focus:outline-none"
        />
        <button
          onClick={handleCheck}
          disabled={loading || !url.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-glow px-5 py-3 text-sm font-semibold text-white shadow-glow-violet transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4" />}
          Inspect URL
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-risk-critical/30 bg-risk-critical/10 p-4 text-sm text-risk-critical">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-4 ${LEVEL_STYLES[result.caution_level]}`}>
            <span className="text-sm font-semibold">{result.caution_level} caution level</span>
            <span className="text-xs opacity-80">host: {result.hostname || "—"}</span>
          </div>

          {result.indicators.length > 0 ? (
            <ul className="space-y-2">
              {result.indicators.map((ind) => (
                <li key={ind.id} className="flex gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3">
                  <AlertOctagon
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      ind.severity === "high" ? "text-risk-high" : ind.severity === "medium" ? "text-risk-medium" : "text-slate-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-100">{ind.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{ind.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No structural phishing patterns were found in this URL's text.</p>
          )}

          <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
