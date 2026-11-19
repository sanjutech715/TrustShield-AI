import { Eraser, Loader2, ScanLine } from "lucide-react";
import { useState } from "react";
import { analyzeMessage } from "../api.js";
import { demoScenarios } from "../data/demoScenarios.js";
import RiskResult from "./RiskResult.jsx";

const LANGUAGES = [
  { id: "auto", label: "Auto-detect" },
  { id: "en", label: "English" },
  { id: "ta", label: "தமிழ்" },
  { id: "tanglish", label: "Tanglish" },
];

export default function AnalyzerPanel({ onAnalyzed }) {
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("auto");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    const { data, error: apiError } = await analyzeMessage(message, language);
    setLoading(false);
    if (apiError) {
      setError(apiError);
      setResult(null);
      return;
    }
    setResult(data);
    onAnalyzed?.();
  }

  function handleClear() {
    setMessage("");
    setResult(null);
    setError(null);
  }

  function loadScenario(scenario) {
    setMessage(scenario.message);
    setResult(null);
    setError(null);
  }

  return (
    <div id="analyzer" className="glass-card glass-border-glow rounded-2xl p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">Smart Scam Analyzer</h3>
          <p className="mt-1 text-sm text-slate-400">
            Paste an SMS, WhatsApp, or email message below. Nothing is sent anywhere except your
            own TrustShield AI backend.
          </p>
        </div>
        <div className="flex gap-1.5 rounded-lg border border-white/10 bg-white/5 p-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                language === lang.id ? "bg-cyan-glow text-void" : "text-slate-300 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        maxLength={4000}
        placeholder={'e.g. "Dear Customer, your account KYC is pending. Share the OTP to verify immediately..."'}
        className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-cyan-glow/50 focus:outline-none"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{message.length} / 4000 characters</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading || !message.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-glow to-azure-glow px-5 py-2.5 text-sm font-semibold text-void shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
          {loading ? "Analyzing…" : "Analyze message"}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white"
        >
          <Eraser className="h-4 w-4" />
          Clear
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Try a sample scenario</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {demoScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => loadScenario(s)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-cyan-glow/40 hover:text-white"
            >
              <span className="block font-medium text-slate-200">{s.title}</span>
              <span className="text-slate-500">{s.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-risk-critical/30 bg-risk-critical/10 p-4 text-sm text-risk-critical">
          {error}
        </div>
      )}

      <RiskResult result={result} />
    </div>
  );
}
