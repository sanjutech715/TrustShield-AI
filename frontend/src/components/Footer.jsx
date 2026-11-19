import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-glow" />
          <span>TrustShield AI — a hackathon prototype, not a certified fraud-detection product.</span>
        </div>
        <p className="max-w-xl text-xs leading-relaxed text-slate-600">
          Risk scores are heuristic indicators from pattern matching, not calibrated probabilities
          or proof of fraud. Always verify through an official channel before acting on any
          message or link.
        </p>
      </div>
    </footer>
  );
}
